import { getDomainInfo } from "./getDomainInfo";
import { NEXT_APP_WEB } from "./env";
import fs from "fs";
import path from "path";

export const domainHtmlMap = {
  "nxt10.optigoapps.com": "sonasons",
  "nxt26.optigoapps.com": "sonasons",
  "thereflections.procatalog.in": "saraff",
  "almacarino.procatalog.in": "almacarino",
  "uscreation.procatalog.in": "uscreation",
  "hemratnajewels.procatalog.in": "hemratnajewels",
  "myras.procatalog.in": "myras",
  "fabgold.procatalog.in": "fabgold",
  "glossyjewel.procatalog.in": "glossyjewel",
  "demo.procatalog.in": "sonasons",
  "company.procatalog.in": "sonasons",
  "test.procatalog.in": "sonasons", // testing domain
  "localhost:5006": "sonasons",
  "localhost:8006": "sonasons",
  "localhost:3000": "sonasons",
  "localhost:4000": "sonasons",
  "procatalog.web": "jeweliita",
  "beta.procatalog.web": "sonasons",
  "jeweliita.procatalog.in": "jeweliita",
  "localhost:8012": "saraff",
  "francisdiamonds.procatalog.in": "francisdiamond",
  "sakungems.procatalog.in": "sakuna",
  "sonasons.procatalog.in": "sonasons",
  "laado.procatalog.in": "sonasons",
};

const pageFileMap = {
  aboutUs: "aboutUs.html",
  privacy: "PrivacyPolicy.html",
  refund: "refundpolicy.html",
  shipping: "ShippingPolicy.html",
  terms: "TermsPolicy.html",
  styleContent: "ColorTheme.txt",
  contact: "contact.html",
};

// In-memory cache keyed by tenant file path for instant access and complete domain isolation
const staticHtmlCache = new Map();

/**
 * Gets static HTML content directly from in-memory cache or disk.
 * Safe for multi-client / multi-domain architectures.
 * @param {string} pageKey - e.g. "aboutUs", "privacy", "refund", "shipping", "terms", "contact"
 * @param {string} host - Hostname for domain resolution
 * @returns {string} HTML content
*/
export function getStaticHtmlContent(pageKey, host) {
  let hostname = host;
  if (hostname) {
    hostname = hostname.replace(/^www\./, "");
  }
  const folder =
    domainHtmlMap[hostname] || domainHtmlMap[NEXT_APP_WEB] || "sonasons";
  const fileName = pageFileMap[pageKey];
  if (!fileName) return "";

  const relativePath = `public/WebSiteStaticImage/html/${folder}/${fileName}`;

  // In production, use in-memory cache. In development, always read fresh so domain binding changes reflect instantly.
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev && staticHtmlCache.has(relativePath)) {
    return staticHtmlCache.get(relativePath);
  }

  try {
    const fullPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (!isDev) {
        staticHtmlCache.set(relativePath, content);
      }
      console.log(`[StaticPage] Loaded (${pageKey}) for host "${host}" -> folder "${folder}" (${relativePath})`);
      return content;
    } else {
      console.warn(`[StaticPage] File not found: ${fullPath}`);
    }
  } catch (err) {
    console.error(`Error reading static file [${folder}/${fileName}]:`, err);
  }

  return "";
}

export async function getStaticHtmlPages(host) {
  let hostname = host;
  if (!hostname) {
    try {
      const domainInfo = await getDomainInfo();
      hostname = domainInfo.hostname;
    } catch (error) {
      console.error(
        1234,
        "Error reading domain info in getStaticHtmlPages:",
        error,
      );
      hostname = NEXT_APP_WEB.replace(/^www\./, "");
    }
  } else {
    hostname = hostname.replace(/^www\./, "");
  }

  const folder =
    domainHtmlMap[hostname] || domainHtmlMap[NEXT_APP_WEB] || "sonasons";
  const pages = Object.fromEntries(
    Object.entries(pageFileMap).map(([key, file]) => [
      key,
      `public/WebSiteStaticImage/html/${folder}/${file}`,
    ]),
  );

  return {
    domain: hostname,
    folder,
    pages,
  };
}
