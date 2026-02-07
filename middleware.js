import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

const domainMap = {
  localhost: NEXT_APP_WEB,
};




export default async function middleware(req) {
  try {
    const { cookies, nextUrl } = req;
    const host = req.headers.get("host");

    const storeName = domainMap[host] || NEXT_APP_WEB;
    let storeData = {};
    try {
      storeData = await fetchStoreInitData(storeName);
    } catch {
      storeData = { rd: [{}], rd1: [], rd2: [{}] };
    }

    const response = NextResponse.next();
    response.cookies.set("x-store-data", JSON.stringify(storeData?.rd?.[0] || {}), { httpOnly: false, path: "/" });
    response.cookies.set("x-myAccountFlags-data", JSON.stringify(storeData?.rd1 || []), { httpOnly: false, path: "/" });
    response.cookies.set("x-CompanyInfoData-data", JSON.stringify(storeData?.rd2?.[0] || {}), { httpOnly: false, path: "/" });
    return response;
  } catch (err) {
    console.error("Middleware fatal error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
  runtime: "nodejs",
};

// import { NextResponse } from "next/server";
// import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
// import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

// const domainMap = {
//   localhost: NEXT_APP_WEB,
// };

// const authPages = [
//   "ContinueWithEmail",
//   "ContinueWithMobile",
//   "ForgotPass",
//   "forgotpass",
//   "LoginOption",
//   "LoginWithEmail",
//   "LoginWithEmailCode",
//   "LoginWithMobileCode",
//   "register",
// ];

// const RestrictPages = ["delivery", "confirmation", "payment"];
// const B2BPages = ["payment", "myWishList", "Lookbook", "delivery", "confirmation", "cartPage", "p/*", "d/*", "account"];
// const WhiteList = ["privacypolicy", "privacypolicy"];

// const storeCache = {};
// const CACHE_TTL = 300 * 1000;

// export default async function middleware(req) {
//   try {
//     const { cookies, nextUrl } = req;
//     const host = req.headers.get("host");

//     const loginUser = cookies.get("LoginUser")?.value;
//     const userLoginCookie = cookies.get("userLoginCookie")?.value;

//     const Next_URL = new URL(req.url);
//     const pathname = nextUrl.pathname.replace(/^\/+/, "").toLowerCase();

//     const storeName = domainMap[host] || NEXT_APP_WEB;
//     let storeData = {};
//     const cacheEntry = storeCache[storeName];
//     const now = Date.now();
//     if (cacheEntry && now - cacheEntry.ts < CACHE_TTL) {
//       storeData = cacheEntry.data;
//     } else {
//       try {
//         storeData = await fetchStoreInitData(storeName);
//       } catch {
//         storeData = { rd: [{}], rd1: [], rd2: [{}] };
//       }
//       storeCache[storeName] = { data: storeData, ts: now };
//     }
//     const IsB2BWebsite = storeData?.rd[0]?.IsB2BWebsite;

//     const isAuthenticated = !!loginUser && !!userLoginCookie;

//     const isAuthPage = authPages.some((page) => pathname === page.toLowerCase());

//     const isPublicPage = WhiteList.some((page) => pathname === page.toLowerCase());

//     const response = NextResponse.next();
//     response.cookies.set("x-store-data", JSON.stringify(storeData?.rd?.[0] || {}), { httpOnly: false, path: "/" });
//     response.cookies.set("x-myAccountFlags-data", JSON.stringify(storeData?.rd1 || []), { httpOnly: false, path: "/" });
//     response.cookies.set("x-CompanyInfoData-data", JSON.stringify(storeData?.rd2?.[0] || {}), { httpOnly: false, path: "/" });
//     response.headers.set("Cache-Control", "public, max-age=604800, immutable");

//     // if (isPublicPage) {
//     //   return response;
//     // }

//     // const isRestrictPage = RestrictPages.some((page) => pathname.startsWith(page.toLowerCase()));

//     // if (pathname.startsWith("LoginOption") || isAuthPage) {
//     //   return response;
//     // }

//     // const isB2BPage = B2BPages.some((page) => {
//     //   if (page.includes("/*")) {
//     //     const prefix = page.replace("/*", "").toLowerCase();
//     //     return pathname.startsWith(prefix);
//     //   }
//     //   return pathname === page.toLowerCase();
//     // });

//     // // 🔹 Case 1: B2B Website → only restrict B2B-specific pages
//     // if (IsB2BWebsite === 1) {
//     //   if (!isAuthenticated && isB2BPage) {
//     //     return NextResponse.redirect(
//     //       new URL(
//     //         `/LoginOption?LoginRedirect=${encodeURIComponent(Next_URL.pathname + Next_URL.search)}`,
//     //         req.url
//     //       )
//     //     );
//     //   }
//     // } else {
//     //   // 🔹 Case 2: Non-B2B Website → only restrict "RestrictPages"
//     //   if (!isAuthenticated && isRestrictPage) {
//     //     return NextResponse.redirect(
//     //       new URL(
//     //         `/LoginOption?LoginRedirect=${encodeURIComponent(Next_URL.pathname + Next_URL.search)}`,
//     //         req.url
//     //       )
//     //     );
//     //   }
//     // }

//     // if (isAuthPage && isAuthenticated && pathname !== "") {
//     //   return NextResponse.redirect(new URL("/", req.url));
//     // }

//     return response;
//   } catch (err) {
//     console.error("Middleware fatal error:", err);
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
//   runtime: "nodejs",
// };
