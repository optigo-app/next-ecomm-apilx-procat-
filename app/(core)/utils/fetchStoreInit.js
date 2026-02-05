import { NEXT_APP_WEB } from "./env";
import { getDomainInfo } from "./getDomainInfo"; 


export async function fetchStoreInitData(req) {
  try {
    let baseUrl = "";
    let hostname = "";
    let protocol = "";
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
    // if (!hostname) hostname = NEXT_APP_WEB;
    const localHosts = ["localhost", "fgstore.pro","nxt26.optigoapps.com","nxt26.optigoapps","nxt26","procatalog.web"];
    const cleanHost = hostname.split(":")[0];
    const isLocalhost = cleanHost === "localhost" || cleanHost === "127.0.0.1" || cleanHost.endsWith(".localhost");

   

    if (localHosts.includes(cleanHost)) {
      // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
      // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
            baseUrl = `http://nzen/R50B3/UFS/StoreInit/${"procatalog.web" || hostname}/StoreInit.json`


      // baseUrl = `${protocol}//${NEXT_APP_WEB}`;
    } else if (isLocalhost) {
      console.log("first");
      // baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;

      //   baseUrl = `${protocol}//${NEXT_APP_WEB}`;
    } else {
      console.log("second");
      //   baseUrl = `${protocol}//${hostname}`;
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
    }
    const staticPathLocal = `${baseUrl}/Website_Store/WebSiteStaticImage/${NEXT_APP_WEB}/StoreInit.json`;
    const staticPathCDN = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
    
    const finalUrl = baseUrl;
    console.log("finalUrl", finalUrl);
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
// import { getDomainInfo } from "./getDomainInfo"; // 👈 import server action

// export async function fetchStoreInitData(req) {
//   try {
//     let baseUrl = "";
//     let hostname = "";
//     let protocol = "";
//     let domainInfo = null;
//     try {
//       domainInfo = await getDomainInfo();
//       hostname = domainInfo.hostname;
//       protocol = domainInfo.protocol;
//     } catch {
//       hostname = "";
//       protocol = "";
//     }

//     if ((!hostname || hostname === "") && typeof window !== "undefined") {
//       const { protocol: winProtocol, hostname: winHost } = window.location;
//       hostname = winHost.replace(/^www\./, "");
//       protocol = winProtocol;
//     }
//     if (!hostname) hostname = NEXT_APP_WEB;
//     const localHosts = ["localhost", "fgstore.pro"];
//     const cleanHost = hostname.split(":")[0];
//     const isLocalhost = cleanHost === "localhost" || cleanHost === "127.0.0.1" || cleanHost.endsWith(".localhost");

//     if (localHosts.includes(cleanHost)) {
//       baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
//       // baseUrl = `${protocol}//${NEXT_APP_WEB}`;
//     } else if (isLocalhost) {
//       console.log("first");
//       baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
//       //   baseUrl = `${protocol}//${NEXT_APP_WEB}`;
//     } else {
//       console.log("second");
//       //   baseUrl = `${protocol}//${hostname}`;
//       baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
//     }
//     const staticPathLocal = `${baseUrl}/Website_Store/WebSiteStaticImage/${NEXT_APP_WEB}/StoreInit.json`;
//     const staticPathCDN = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;
    
//     const finalUrl = baseUrl;
//     const response = await fetch(finalUrl);
//     if (!response.ok) throw new Error(`HTTP error ${response.status}`);
//     const jsonData = await response.json();
//     return jsonData || null;
//   } catch (error) {
//     console.error("❌ Error fetching StoreInit data:", error);
//     return null;
//   }
// }
