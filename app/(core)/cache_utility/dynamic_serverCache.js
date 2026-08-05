import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".next_cache");
const MENU_CACHE_DIR = path.join(CACHE_DIR, "menu");
const INDEX_FILE = path.join(CACHE_DIR, "cache_index.json");

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
if (!fs.existsSync(MENU_CACHE_DIR)) fs.mkdirSync(MENU_CACHE_DIR, { recursive: true });

const defaultTTL = 12 * 60 * 60 * 1000; // 12h
const safeKey = (key) => key.replace(/[^a-zA-Z0-9_\-]/g, "_");

const resolveCacheFilePath = (key) => {
  if (!key) return path.join(CACHE_DIR, "invalid_key.json");
  if (key.startsWith("menu/")) {
    const cleanKey = safeKey(key.replace(/^menu\//, ""));
    return path.join(MENU_CACHE_DIR, `${cleanKey}.json`);
  }
  return path.join(CACHE_DIR, `${safeKey(key)}.json`);
};

// ─── Index helpers ────────────────────────────────────────────────────────────
// Simple promise-based write lock so concurrent setCache calls don't corrupt
// the index file.
let _indexWriteLock = Promise.resolve();

function _acquireIndexLock(fn) {
  const next = _indexWriteLock.then(fn).catch(() => {});
  _indexWriteLock = next;
  return next;
}

function _readIndexSync() {
  try {
    if (!fs.existsSync(INDEX_FILE)) return {};
    return JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function _readIndex() {
  try {
    if (!fs.existsSync(INDEX_FILE)) return {};
    const raw = await fs.promises.readFile(INDEX_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function _writeIndex(index) {
  // Write to a temp file first, then rename — atomic on most OS/FS.
  const tmp = INDEX_FILE + ".tmp";
  await fs.promises.writeFile(tmp, JSON.stringify(index), "utf8");
  await fs.promises.rename(tmp, INDEX_FILE);
}

function _getCategoryFromRelPath(relPath) {
  if (relPath.startsWith("menu/")) return "Menu";
  if (relPath.includes("storeInit")) return "StoreInit";
  if (relPath.includes("pl_") || relPath.includes("pd_")) return "Product";
  return "General";
}

/** Add or update a single entry in the index (runs inside the write lock). */
async function _indexSet(key, file, sizeBytes, timestamp, meta) {
  await _acquireIndexLock(async () => {
    const index = await _readIndex();
    const relPath = path.relative(CACHE_DIR, file).replace(/\\/g, "/");
    const category = _getCategoryFromRelPath(relPath);
    index[key] = {
      fileName: relPath,
      originalKey: key,
      timestamp,
      sizeKB: (sizeBytes / 1024).toFixed(2) + " KB",
      meta: { ...(meta || {}), category },
      expiresAt: timestamp + defaultTTL,
      isExpired: Date.now() > timestamp + defaultTTL,
    };
    await _writeIndex(index);
  });
}

/** Remove a single entry from the index (runs inside the write lock). */
async function _indexDelete(key) {
  await _acquireIndexLock(async () => {
    const index = await _readIndex();
    delete index[key];
    await _writeIndex(index);
  });
}

/** Wipe the entire index (runs inside the write lock). */
async function _indexClear() {
  await _acquireIndexLock(async () => {
    await _writeIndex({});
  });
}

// ─── Payload validation ───────────────────────────────────────────────────────

const isInvalidArray = (arr) => {
  if (!Array.isArray(arr)) return false;
  if (arr.length === 0) return true;
  return arr.some(
    (item) =>
      item?.stat === 0 ||
      item?.stat === "0" ||
      (typeof item?.stat_msg === "string" &&
        (item.stat_msg.toLowerCase().includes("error") ||
         item.stat_msg.toLowerCase().includes("fail")))
  );
};

const isErrorPayload = (data) => {
  if (data === null || data === undefined) return true;

  if (Array.isArray(data)) return isInvalidArray(data);

  if (typeof data === "object") {
    if (Object.keys(data).length === 0) return true;
    if (data?.stat === 0 || data?.stat === "0") return true;

    if (data?.Status !== undefined && data?.Status !== null) {
      const statusStr = String(data.Status).trim();
      if (statusStr !== "200" && statusStr !== "201" && statusStr !== "1") return true;
    }

    const msg = (data?.stat_msg || data?.Message || "").toString().toLowerCase();
    if (msg.includes("network error") || msg.includes("server error") || msg.includes("failed")) {
      return true;
    }

    if (Array.isArray(data?.Data) && isInvalidArray(data.Data)) return true;
    if (Array.isArray(data?.rd) && isInvalidArray(data.rd)) return true;
    if (Array.isArray(data?.Data?.rd) && isInvalidArray(data.Data.rd)) return true;
    if (Array.isArray(data?.pdResp?.rd) && isInvalidArray(data.pdResp.rd)) return true;
  }

  return false;
};

// ─── Public API ───────────────────────────────────────────────────────────────

export async function setCache(key, data, meta) {
  if (isErrorPayload(data)) {
    console.warn(`⚠️ [CACHE WRITE ABORTED - ERROR OR EMPTY DATA] ${key}`);
    return;
  }

  const now = Date.now();
  const file = resolveCacheFilePath(key);
  const payload = { key, timestamp: now, meta, data };
  const raw = JSON.stringify(payload);

  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(file, raw, "utf8");
    console.log(`✅ [CACHE SAVED] ${key}`);

    // Update index with byte size derived from the serialised string (no stat() call needed).
    await _indexSet(key, file, Buffer.byteLength(raw, "utf8"), now, meta);
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
      console.warn(`⚠️ [CACHE INVALIDATED - CONTAINS ERROR OR EMPTY DATA] ${key}`);
      fs.promises.unlink(file).catch(() => {});
      _indexDelete(key).catch(() => {});
      return null;
    }

    if (now - cached.timestamp < ttlMs) {
      return cached.data;
    }
    console.log(`⏰ [CACHE EXPIRED] ${key}`);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn(`⚠️ Error reading/parsing cache file for ${key}:`, err.message);
    }
  }

  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}

export async function getCacheWithMeta(key, ttlMs = defaultTTL) {
  const now = Date.now();
  const file = resolveCacheFilePath(key);

  try {
    const content = await fs.promises.readFile(file, "utf8");
    const cached = JSON.parse(content);

    if (isErrorPayload(cached?.data)) {
      console.warn(`⚠️ [CACHE INVALIDATED WITH META - CONTAINS ERROR OR EMPTY DATA] ${key}`);
      fs.promises.unlink(file).catch(() => {});
      _indexDelete(key).catch(() => {});
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
    if (err.code !== "ENOENT") {
      console.warn(`⚠️ Error reading cache with meta for ${key}:`, err.message);
    }
  }

  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/**
 * Returns all cached items by reading only cache_index.json.
 * No disk reads of individual cache files. O(1) I/O instead of O(N).
 *
 * Falls back to the legacy file-scan if the index is missing or empty
 * (e.g. first boot after upgrade) and rebuilds the index automatically.
 */
export async function getAllCachedItems() {
  if (!fs.existsSync(CACHE_DIR)) return [];

  try {
    const now = Date.now();
    let index = await _readIndex();

    // ── Fallback: rebuild index from disk if it is empty ──────────────────
    if (Object.keys(index).length === 0 && fs.existsSync(CACHE_DIR)) {
      console.log("🔄 [INDEX REBUILD] cache_index.json is empty — scanning files once to rebuild.");
      index = await _rebuildIndex();
    }

    const items = Object.values(index).map((entry) => ({
      ...entry,
      // Recompute isExpired at read-time so it's always accurate.
      isExpired: now > entry.expiresAt,
    }));

    return items.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error("Error reading cache index:", err);
    return [];
  }
}

/**
 * Scans disk once and rebuilds cache_index.json.
 * Only called when the index file doesn't exist (e.g. first run after upgrade).
 */
async function _rebuildIndex() {
  const allFiles = await _getFilesRecursive(CACHE_DIR);
  const index = {};

  for (const filePath of allFiles) {
    if (!filePath.endsWith(".json")) continue;
    if (filePath === INDEX_FILE) continue; // skip the index file itself

    try {
      const [stats, content] = await Promise.all([
        fs.promises.stat(filePath),
        fs.promises.readFile(filePath, "utf8"),
      ]);
      const json = JSON.parse(content);
      const relPath = path.relative(CACHE_DIR, filePath).replace(/\\/g, "/");
      const category = _getCategoryFromRelPath(relPath);
      const key = json.key || relPath.replace(".json", "");

      index[key] = {
        fileName: relPath,
        originalKey: key,
        timestamp: json.timestamp,
        sizeKB: (stats.size / 1024).toFixed(2) + " KB",
        meta: { ...(json.meta || {}), category },
        expiresAt: json.timestamp + defaultTTL,
        isExpired: Date.now() > json.timestamp + defaultTTL,
      };
    } catch {
      // Skip corrupt files silently during rebuild.
    }
  }

  await _acquireIndexLock(() => _writeIndex(index));
  console.log(`✅ [INDEX REBUILD COMPLETE] ${Object.keys(index).length} entries indexed.`);
  return index;
}

async function _getFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? _getFilesRecursive(fullPath) : fullPath;
      })
    );
    return Array.prototype.concat(...files);
  } catch {
    return [];
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

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
      await _indexDelete(key);
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
      // Reset index to empty object (directories were just wiped).
      await _indexClear();
      console.log("🗑️ Cleared and recreated all cache directories recursively");
    } catch (err) {
      console.error("Error clearing all cache:", err);
    }
  }
}
