import fs from "fs";
import path from "path";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";

const STORE_INIT_DIR = path.join(process.cwd(), "public", "storeInit");
const TTL_MS = Number(process.env.STORE_INIT_CACHE_TTL_MS) || 60_000; // 60 s default

const DEFAULT_DATA = { rd: [{}], rd1: [], rd2: [{}] };

const memoryCache = new Map();
const pendingMap  = new Map();

function sanitizeKey(host) {
  return host
    ? host.split(":")[0].replace(/[^a-zA-Z0-9._-]/g, "_")
    : process.env.NEXT_APP_WEB || "localhost";
}

function diskPath(cacheKey) {
  return path.join(STORE_INIT_DIR, `${cacheKey}_storeInit.json`);
}

function getVersion(data) {
  return data?.rd?.[0]?.FileCreateDate ?? data?.FileCreateDate ?? null;
}

async function writeDisk(filePath, data) {
  const tmpPath = filePath + ".tmp";
  try {
    await fs.promises.mkdir(STORE_INIT_DIR, { recursive: true });
    await fs.promises.writeFile(tmpPath, JSON.stringify(data), "utf8");
    await fs.promises.rename(tmpPath, filePath);
  } catch (err) {
    console.error("[StoreInit] Disk write failed:", err.message);
    fs.promises.unlink(tmpPath).catch(() => {});
  }
}

function readDiskSync(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.warn("[StoreInit] Disk read failed:", err.message);
    return null;
  }
}

function isDiskStale(filePath) {
  try {
    const { mtimeMs } = fs.statSync(filePath);
    return Date.now() - mtimeMs >= TTL_MS;
  } catch {
    return true;
  }
}

async function _doRevalidate(cacheKey, existingData) {
  const filePath = diskPath(cacheKey);
  try {
    const remote = await fetchStoreInitData();

    if (!remote || Object.keys(remote).length === 0) {
      if (existingData) {
        memoryCache.set(cacheKey, { data: existingData, cachedAt: Date.now() });
      }
      return existingData ?? DEFAULT_DATA;
    }

    const remoteVersion = getVersion(remote);
    const localVersion  = getVersion(existingData);

    if (remoteVersion && localVersion && remoteVersion === localVersion) {
      try {
        await fs.promises.utimes(filePath, new Date(), new Date());
      } catch {}
      memoryCache.set(cacheKey, { data: existingData, cachedAt: Date.now() });
      return existingData;
    }

    await writeDisk(filePath, remote);

    memoryCache.set(cacheKey, { data: remote, cachedAt: Date.now() });
    return remote;
  } catch (err) {
    console.error("[StoreInit] Revalidation error:", err.message);
    return existingData ?? DEFAULT_DATA;
  } finally {
    pendingMap.delete(cacheKey);
  }
}

function triggerBackgroundRevalidate(cacheKey, existingData) {
  if (pendingMap.has(cacheKey)) return;
  const promise = _doRevalidate(cacheKey, existingData);
  pendingMap.set(cacheKey, promise);
}

export function getStoreInitCachedSync(host) {
  const cacheKey = sanitizeKey(host);
  const filePath = diskPath(cacheKey);

  const mem = memoryCache.get(cacheKey);
  if (mem) {
    const memAge = Date.now() - mem.cachedAt;
    if (memAge >= TTL_MS) {
      triggerBackgroundRevalidate(cacheKey, mem.data);
    }
    return mem.data;
  }

  const diskData = readDiskSync(filePath);
  if (diskData) {
    memoryCache.set(cacheKey, { data: diskData, cachedAt: Date.now() });
    if (isDiskStale(filePath)) {
      triggerBackgroundRevalidate(cacheKey, diskData);
    }
    return diskData;
  }

  triggerBackgroundRevalidate(cacheKey, null);
  return DEFAULT_DATA;
}

export async function getStoreInitCached(host) {
  const cacheKey = sanitizeKey(host);
  const filePath = diskPath(cacheKey);

  const mem = memoryCache.get(cacheKey);
  if (mem) {
    if (Date.now() - mem.cachedAt >= TTL_MS) {
      triggerBackgroundRevalidate(cacheKey, mem.data);
    }
    return mem.data;
  }

  const diskData = readDiskSync(filePath);
  if (diskData) {
    memoryCache.set(cacheKey, { data: diskData, cachedAt: Date.now() });
    if (isDiskStale(filePath)) {
      triggerBackgroundRevalidate(cacheKey, diskData);
    }
    return diskData;
  }

  if (pendingMap.has(cacheKey)) {
    return pendingMap.get(cacheKey);
  }

  return _doRevalidate(cacheKey, null);
}

export async function revalidateStoreInitCache(host) {
  const cacheKey = sanitizeKey(host);
  memoryCache.delete(cacheKey);
  const existing = readDiskSync(diskPath(cacheKey));
  return _doRevalidate(cacheKey, existing);
}
