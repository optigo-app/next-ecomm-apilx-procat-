import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".next_cache");
const MENU_CACHE_DIR = path.join(CACHE_DIR, "menu");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
if (!fs.existsSync(MENU_CACHE_DIR)) fs.mkdirSync(MENU_CACHE_DIR, { recursive: true });

const defaultTTL = 12 * 60 * 60 * 1000; // 12h
const safeKey = (key) => key.replace(/[^a-zA-Z0-9_\-]/g, "_");

const resolveCacheFilePath = (key) => {
  if (key.startsWith("menu/")) {
    const cleanKey = safeKey(key.replace("menu/", ""));
    return path.join(MENU_CACHE_DIR, `${cleanKey}.json`);
  }
  return path.join(CACHE_DIR, `${safeKey(key)}.json`);
};

const isErrorPayload = (data) => {
  if (!data) return true;
  if (Array.isArray(data)) {
    if (data.length === 0) return false;
    return data.some(
      (item) =>
        item?.stat === 0 ||
        (typeof item?.stat_msg === "string" &&
          item.stat_msg.toLowerCase().includes("network error")),
    );
  }
  if (typeof data === "object") {
    if (data?.stat === 0) return true;
    if (
      Array.isArray(data?.rd) &&
      data.rd.some((item) => item?.stat === 0)
    )
      return true;
    if (
      Array.isArray(data?.Data?.rd) &&
      data.Data.rd.some((item) => item?.stat === 0)
    )
      return true;
  }
  return false;
};

export async function setCache(key, data, meta) {
  if (isErrorPayload(data)) {
    console.warn(`⚠️ [CACHE WRITE ABORTED - ERROR DATA] ${key}`);
    return;
  }

  const now = Date.now();
  const file = resolveCacheFilePath(key);
  const payload = {
    timestamp: now,
    meta,
    data,
  };

  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(file, JSON.stringify(payload), "utf8");
    console.log(`✅ [CACHE SAVED] ${key}`);
  } catch (err) {
    console.error(`❌ Cache write failed for ${key}:`, err);
  }
}

export async function getCache(key, ttlMs = defaultTTL) {
  const now = Date.now();
  const file = resolveCacheFilePath(key);

  try {
    const content = await fs.promises.readFile(file, "utf8");
    const cached = JSON.parse(content);

    if (isErrorPayload(cached?.data)) {
      console.warn(`⚠️ [CACHE INVALIDATED - CONTAINS ERROR DATA] ${key}`);
      fs.promises.unlink(file).catch(() => {});
      return null;
    }

    if (now - cached.timestamp < ttlMs) {
      return cached.data;
    }
    console.log(`⏰ [CACHE EXPIRED] ${key}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`⚠️ Error reading/parsing cache file for ${key}:`, err.message);
    }
  }

  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}

export async function getCacheWithMeta(key, ttlMs = defaultTTL) {
  const now = Date.now();
  const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);

  try {
    const content = await fs.promises.readFile(file, "utf8");
    const cached = JSON.parse(content);
    if (isErrorPayload(cached?.data)) {
      console.warn(`⚠️ [CACHE INVALIDATED WITH META - CONTAINS ERROR DATA] ${key}`);
      fs.promises.unlink(file).catch(() => {});
      return null;
    }
    if (now - cached.timestamp < ttlMs) {
      console.log(`💾 [CACHE HIT WITH META] ${key}`);
      return {
        data: cached.data,
        meta: cached.meta || {},
        timestamp: cached.timestamp,
        CacheRebuildDate: cached.meta?.CacheRebuildDate ?? null,
      };
    }
    console.log(`⏰ [CACHE EXPIRED] ${key}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`⚠️ Error reading cache with meta for ${key}:`, err.message);
    }
  }

  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}

export async function clearCache(key) {
  try {
    let file = resolveCacheFilePath(key);
    if (!fs.existsSync(file)) {
      const filename = key.endsWith(".json") ? key : `${safeKey(key)}.json`;
      file = path.join(CACHE_DIR, filename);
    }

    if (fs.existsSync(file)) {
      await fs.promises.unlink(file);
      console.log(`🗑️ [CACHE CLEARED] ${key}`);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function clearAllCache() {
  if (fs.existsSync(CACHE_DIR)) {
    try {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true });
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      fs.mkdirSync(MENU_CACHE_DIR, { recursive: true });
      console.log("🗑️ Cleared and recreated all cache directories recursively");
    } catch (err) {
      console.error("Error clearing all cache:", err);
    }
  }
}
