import fs from "fs";
import path from "path";

// const CACHE_DIR = path.resolve("F:/next-ecomm(apilx)/app/next_cache");
const CACHE_DIR = path.join(process.cwd(), ".next_cache");

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const defaultTTL = 12 * 60 * 60 * 1000; // 12h

// 🧠 Memory layer (Map keeps cache in RAM)
const memoryCache = new Map();

// 🔒 Safe file key
const safeKey = (key) => key.replace(/[^a-zA-Z0-9_\-]/g, "_");

// ⚡ Fast setCache: memory + async file write
export async function setCache(key, data) {
  const now = Date.now();
  const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);
  const payload = { timestamp: now, data };

  // ✅ store in memory first
  memoryCache.set(key, payload);

  // 💾 async write (non-blocking)
  fs.promises
    .writeFile(file, JSON.stringify(payload, null, 2), "utf8")
    .then(() => console.log(`✅ [CACHE SAVED] ${key}`))
    .catch((err) => console.error(`❌ Cache write failed for ${key}:`, err));
}

// ⚡ Ultra-fast getCache
export async function getCache(key, ttlMs = defaultTTL) {
  const now = Date.now();
  const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);

  // 1️⃣ Check in-memory cache first
  const mem = memoryCache.get(key);
  if (mem && now - mem.timestamp < ttlMs) {
    // instant (RAM)
    console.log(`⚡ [CACHE HIT - MEM] ${key}`);
    return mem.data;
  }

  // 2️⃣ Fallback to disk cache
  if (fs.existsSync(file)) {
    try {
      const cached = JSON.parse(fs.readFileSync(file, "utf8"));
      if (now - cached.timestamp < ttlMs) {
        // refresh memory layer
        memoryCache.set(key, cached);
        console.log(`💾 [CACHE HIT - DISK] ${key}`);
        return cached.data;
      }
      console.log(`⏰ [CACHE EXPIRED] ${key}`);
    } catch (err) {
      console.warn(`⚠️ Corrupt cache file for ${key}, removing`);
      fs.unlinkSync(file);
    }
  }

  // 3️⃣ Cache miss
  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}

// 🧹 Clear cache
export async function clearCache(key) {
  memoryCache.delete(key);
  const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  console.log(`🗑️ [CACHE CLEARED] ${key}`);
}

export async function clearAllCache() {
  memoryCache.clear();
  fs.rmSync(CACHE_DIR, { recursive: true, force: true });
  console.log("🗑️ Cleared .next_cache folder");
}

// import fs from "fs";
// import path from "path";


// const CACHE_DIR = path.join(process.cwd(), ".next_cache");
// if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// const defaultTTL = 12 * 60 * 60 * 1000; // 12h

// // 🔒 Sanitize filename
// function safeKey(key) {
//   return key.replace(/[^a-zA-Z0-9_\-]/g, "_");
// }

// // 📦 Save data to cache
// export async function setCache(key, data) {
//   const now = Date.now();
//   const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);
//   const tmp = `${file}.tmp`;

//   const payload = JSON.stringify({ timestamp: now, data }, null, 2);

//   try {
//     fs.writeFileSync(tmp, payload, "utf8");
//     fs.renameSync(tmp, file);
//     console.log(`✅ [CACHE SAVED] ${key}`);
//   } catch (err) {
//     console.error(`❌ Failed to write cache for ${key}:`, err);
//   }
// }

// // 📤 Read cache if not expired
// export async function getCache(key, ttlMs = defaultTTL) {
//   const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);
//   const now = Date.now();

//   if (!fs.existsSync(file)) return null;

//   try {
//     const cached = JSON.parse(fs.readFileSync(file, "utf8"));
//     if (now - cached.timestamp < ttlMs) {
//       console.log(`⚡ [CACHE HIT] ${key}`);
//       return cached.data;
//     }

//     console.log(`⏰ [CACHE EXPIRED] ${key}`);
//     return null;
//   } catch (err) {
//     console.warn(`⚠️ Corrupt cache file for ${key}, removing`);
//     fs.unlinkSync(file);
//     return null;
//   }
// }

// // 🧹 Clear cache (optional)
// export async function clearCache(key) {
//   const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);
//   if (fs.existsSync(file)) fs.unlinkSync(file);
//   console.log(`🗑️ [CACHE CLEARED] ${key}`);
// }



// // const CACHE_DIR = path.resolve("F:/next-ecomm(apilx)/app/next_cache");
