// export async function fetchStoreInitData() {
//     try {
//         // ✅ Always call the fixed CDN JSON file
//         const staticPathCDN = `https://cdnfs.optigoapps.com/content-global3/StoreInit/nxt10.optigoapps.com/StoreInit.json`;

//         const response = await fetch(staticPathCDN);

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const jsonData = await response.json();
//         return jsonData || null;
//     } catch (error) {
//         console.error("❌ Error fetching StoreInit data:", error);
//         return null;
//     }
// }

import { NEXT_APP_WEB } from "./env";
import { getDomainInfo } from "./getDomainInfo"; // 👈 import server action

export async function fetchStoreInitData(req) {
    try {
        let baseUrl = "";
        let hostname = "";
        let protocol = "";

        // ✅ 1️⃣ Get domain info from server action
        let domainInfo = null;

        try {
            domainInfo = await getDomainInfo();
            hostname = domainInfo.hostname;
            protocol = domainInfo.protocol;
        } catch {
            hostname = "";
            protocol = "";
        }

        if ((!hostname || hostname === "") && typeof window !== "undefined") {
            const { protocol: winProtocol, hostname: winHost } = window.location;
            hostname = winHost.replace(/^www\./, "");
            protocol = winProtocol;
        }

        if (!hostname) hostname = NEXT_APP_WEB;

        const localHosts = [
            "localhost",
            "nzen",
            "fgstore.web",
            "fgstore.mapp",
            "fgstorepro.mapp",
            "fgstore.pro",
            "fgstore.plw",
            "malakan.web",
            "rpjewel.web",
            "hdstore.web",
            "hdstore.mapp",
            "hdstore.pro",
            "hdstore.plw",
            "mddesignworld.web",
            "elvee.web",
            "diamondtine.web",
            "stamford.web",
            "forevery.web",
            "hoq.web",
        ];

        if (localHosts.includes(hostname)) {
            baseUrl = `${protocol}//${NEXT_APP_WEB}`;
        } else {
            baseUrl = `${protocol}//${hostname}`;
        }

        const staticPathLocal = `${baseUrl}/Website_Store/WebSiteStaticImage/${NEXT_APP_WEB}/StoreInit.json`;
        const staticPathCDN = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;

        const finalUrl = localHosts.includes(hostname)
            ? staticPathLocal
            : staticPathCDN;

        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const jsonData = await response.json();
        return jsonData || null;
    } catch (error) {
        console.error("❌ Error fetching StoreInit data:", error);
        return null;
    }
}

// import { NEXT_APP_WEB } from "./env";

// export async function fetchStoreInitData() {
//     try {
//         let baseUrl;

//         if (typeof window !== "undefined") {
//             // ✅ Client-side: detect from browser URL
//             let { protocol, hostname, port } = window.location;

//             // Remove "www." prefix if exists
//             if (hostname.startsWith("www.")) {
//                 hostname = hostname.substring(4);
//             }

//             // If running locally, fallback to NEXT_APP_WEB
//             if (
//                 hostname === "localhost" ||
//                 hostname === "127.0.0.1" ||
//                 hostname === "zen"
//             ) {
//                 // baseUrl = `${protocol}//${NEXT_APP_WEB}${port ? `:${port}` : ""}`;
//                 baseUrl = `${protocol}//${NEXT_APP_WEB}`;
//             } else {
//                 baseUrl = `${protocol}//${NEXT_APP_WEB}`;
//             }
//         } else {
//             // ✅ Server-side (Next.js SSR)
//             const devHost = process.env.HOST || "localhost";
//             const devPort = process.env.PORT || "3000"; // can be overridden
//             const protocol =
//                 process.env.NODE_ENV === "development" ? "http:" : "https:";

//             if (process.env.NODE_ENV === "development") {
//                 // baseUrl = `${protocol}//${NEXT_APP_WEB}:${devPort}`;
//                 baseUrl = `${protocol}//${NEXT_APP_WEB}`;
//             } else {
//                 baseUrl = `${protocol}//${NEXT_APP_WEB}`;
//             }
//         }

//         const staticPath = `${baseUrl}/Website_Store/WebSiteStaticImage/${NEXT_APP_WEB}`;
//         const response = await fetch(`${staticPath}/StoreInit.json`);

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const jsonData = await response.json();
//         return jsonData || null;
//     } catch (error) {
//         console.error("Error fetching StoreInit data:", error);
//         return null;
//     }
// }




