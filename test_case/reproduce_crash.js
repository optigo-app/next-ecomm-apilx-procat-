
const mockSessionStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    clear() {
        this.store = {};
    }
};

global.sessionStorage = mockSessionStorage;
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');

// Mock getSession from FetchSessionData
const getSession = (key, defaultValue = null) => {
    const value = sessionStorage.getItem(key);
    if (value === null) return defaultValue;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

// Mock CommonAPI
const CommonAPI = async (body) => {
    console.log("CommonAPI called with body:", body);
    return { Data: { rd: [] } };
};

// Simplified StockItemApi for testing the crash
const StockItemApiTest = async (ac, type, obj = {}, visiterId) => {
    let storeInit = getSession("storeInit");
    let loginUserDetail = getSession("loginUserDetail");
    let islogin = getSession("LoginUser") ?? false;

    try {
        // This is the FIXED line
        const customerId = (storeInit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? visiterId : loginUserDetail?.id ?? 0;
        console.log("CustomerId calculated:", customerId);
    } catch (err) {
        console.error("CRASH DETECTED:", err.message);
    }
};

async function runTest() {
    console.log("--- Test 1: loginUserDetail is null but islogin is true ---");
    sessionStorage.setItem("LoginUser", "true");
    sessionStorage.setItem("loginUserDetail", "null"); // simulated null session storage

    await StockItemApiTest("123", "stockitem", {}, "visiter123");
}

runTest();
