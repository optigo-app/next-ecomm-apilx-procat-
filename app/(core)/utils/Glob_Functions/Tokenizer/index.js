import CryptoJS from "crypto-js";
import cookies from "js-cookie";
const SECRET_KEY = "019560ac-9912-754b-8229-c78f35251f40-51f40-399125251f40";

export const generateToken = (userData, long) => {
    const expirationOneMin = Date.now() + 1 * 60 * 1000;
    const expiration1Day = Date.now() + 1 * 24 * 60 * 60 * 1000;
    const expiration30Days = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const exp = long == 1 ? expiration30Days : expiration1Day;
    const type = long == 1 ? '30DT' : '1DT';
    const payload = {
        cookie: userData,
        exp,
        type
    };

    const encodedPayload = btoa(JSON.stringify(payload));

    const signature = CryptoJS.HmacSHA256(encodedPayload, SECRET_KEY).toString(CryptoJS.enc.Base64);

    return `${encodedPayload}.${signature}`;
};

export const verifyToken = (token) => {
    if (!token) return { status: "unauthorized", message: "Token is missing" };

    try {
        const [encodedPayload, signature] = token.split(".");
        if (!encodedPayload || !signature) {
            return { status: "unauthorized", message: "Invalid token format" };
        }
        const payload = JSON.parse(atob(encodedPayload));

        if (Date.now() > payload.exp) {
            window.localStorage.removeItem("AuthToken");
            sessionStorage.setItem("LoginUser", false);
            cookies.remove("AuthToken");
            cookies.remove("userLoginCookie");
            return { status: "unauthorized", message: "Token expired" };
        }
        const expectedSignature = CryptoJS.HmacSHA256(encodedPayload, SECRET_KEY).toString(CryptoJS.enc.Base64);
        if (signature !== expectedSignature) {
            return { status: "unauthorized", message: "Invalid token signature" };
        }

        return { status: "authorized", data: payload };
    } catch (error) {
        console.error("Token verification error:", error);
        return { status: "unauthorized", message: "Invalid token" };
    }
};

export const getLocalStorageValue = (key) => {
    try {
        const item = localStorage?.getItem(key) ?? sessionStorage?.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error retrieving ${key} from localStorage:`, error);
        return null;
    }
};
