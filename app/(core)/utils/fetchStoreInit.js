import { NEXT_APP_WEB } from "./env";
import { getDomainInfo } from "./getDomainInfo";

// const staticPathLocal = `${baseUrl}/Website_Store/WebSiteStaticImage/${NEXT_APP_WEB}/StoreInit.json`;
// const staticPathCDN = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${NEXT_APP_WEB}/StoreInit.json`;


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
   
    const localHosts = ["localhost", "fgstore.pro", "procatalog.web", "nzen"];
    const cleanHost = hostname.split(":")[0];
    const isLocalhost = cleanHost === "localhost" || cleanHost === "127.0.0.1" || cleanHost.endsWith(".localhost");

     if (cleanHost == 'nxt26.optigoapps.com') {
      hostname = `nxt10.optigoapps.com`
    }
    
    if (localHosts.includes(cleanHost)) {
      baseUrl = `http://192.168.1.153/R50B3/UFS/StoreInit/procatalog.web/StoreInit.json`
    } else if (isLocalhost) {
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
    }
    else {
      baseUrl = `https://cdnfs.optigoapps.com/content-global3/StoreInit/${hostname}/StoreInit.json`;
    }
    const finalUrl = baseUrl;
    const response = await fetch(finalUrl);
    if (!Boolean(response.ok)) throw new Error(`HTTP error ${response.status}`);
    const jsonData = await response.json();
    return jsonData || null;
  } catch (error) {
    console.error("❌ Error fetching StoreInit data:", error);
    return null;
  }
}

