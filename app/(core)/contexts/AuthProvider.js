"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginWithEmailAPI } from "../utils/API/Auth/LoginWithEmailAPI";
import { useStore } from "./StoreProvider";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children, storeInit }) {
  const { islogin, setislogin } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginRedirect = searchParams.get("LoginRedirect");
  const redirectEmailUrl = loginRedirect ? decodeURIComponent(loginRedirect) : "/";
  const [localData, setLocalData] = useState(null);

    // (() => {
    //   const originalLog = console.log;
    //   const originalError = console.error;
    //   const originalWarn = console.warn;
    //   const originalInfo = console.info;

    //   // 🎨 Define global styles
    //   const styles = {
    //     base: "font-size: 14px; font-weight: 500; color: #212121; background: #fafafa; padding: 4px 8px; border-radius: 4px;",
    //     log: "color: #1976d2; font-weight: 600; font-size: 15px;",
    //     warn: "color: #f57c00; font-weight: 600; font-size: 15px;",
    //     error: "color: #fff; background: #d32f2f; font-weight: 700; font-size: 16px; padding: 6px 10px; border-radius: 6px;",
    //     info: "color: #0288d1; font-weight: 600; font-size: 15px;",
    //   };

    //   // 🧠 Override log
    //   console.log = function (...args) {
    //     originalLog.apply(console, ["%c🟦 LOG:", styles.log, ...args]);
    //   };

    //   // ⚠️ Override warn
    //   console.warn = function (...args) {
    //     originalWarn.apply(console, ["%c⚠️ WARNING:", styles.warn, ...args]);
    //   };

    //   // ❌ Override error
    //   console.error = function (...args) {
    //     originalError.apply(console, ["%c❌ ERROR:", styles.error, ...args]);
    //   };

    //   // ℹ️ Override info
    //   console.info = function (...args) {
    //     originalInfo.apply(console, ["%cℹ️ INFO:", styles.info, ...args]);
    //   };

    //   // ✅ Optional: Global header on app start
    //   originalLog(
    //     "%c🌐 Global Console Theme Applied — Styled Console Active",
    //     "background: #4caf50; color: white; font-size: 14px; font-weight: 600; padding: 6px 10px; border-radius: 4px;"
    //   );
    // })();

  useEffect(() => {
    const cookieValue = Cookies.get("userLoginCookie");
    if (cookieValue && islogin === false) {
      LoginWithEmailAPI("", "", "", "", cookieValue)
        .then((response) => {
          if (response?.Data?.rd[0]?.stat === 1) {
            Cookies.set("userLoginCookie", response?.Data?.rd[0]?.Token);
            setislogin(true);
            sessionStorage.setItem("LoginUser", true);
            sessionStorage.setItem("loginUserDetail", JSON.stringify(response.Data.rd[0]));
            if (redirectEmailUrl) {
              router.push(redirectEmailUrl);
            } else if (location.pathname.startsWith("/accountdwsr")) {
              router.push("/accountdwsr");
            } else {
              // router.push("/");
            }
          }
        })
        .catch((err) => console.log(err));
    }
    let localD = storeInit
    setLocalData(localD);
  }, [islogin, redirectEmailUrl]);

  const value = {
    localData,
    setLocalData
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
