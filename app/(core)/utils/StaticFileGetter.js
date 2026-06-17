import { getDomainInfo } from "./getDomainInfo";
import { NEXT_APP_WEB } from "./env";

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
  "test.procatalog.in": "sonasons",         // testing domain 
  "localhost:5006": 'sonasons',
  "localhost:8006": 'sonasons',
  "localhost:3000": 'sonasons',
  "localhost:4000": 'sonasons',
  'procatalog.web': 'francisdiamond',
  'beta.procatalog.web': 'sonasons',
  'jeweliita.procatalog.in': 'jeweliita',
  "localhost:8012": 'sakuna',
  "francisdiamonds.procatalog.in": 'francisdiamond',
  'sakungems.procatalog.in': 'sakuna',
  "sonasons.procatalog.in": 'sonasons'
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



export async function getStaticHtmlPages(host) {
  let hostname = host;
  if (!hostname) {
    try {
      const domainInfo = await getDomainInfo();
      hostname = domainInfo.hostname;
      console.log(123, "worked", domainInfo)
    } catch (error) {
      console.error(1234, "Error reading domain info in getStaticHtmlPages:", error);
      hostname = NEXT_APP_WEB.replace(/^www\./, "");
    }
  } else {
    hostname = hostname.replace(/^www\./, "");
  }

  const folder = domainHtmlMap[hostname] || domainHtmlMap[NEXT_APP_WEB] || "sonasons";
  const pages = Object.fromEntries(
    Object.entries(pageFileMap).map(([key, file]) => [
      key,
      `public/WebSiteStaticImage/html/${folder}/${file}`,
    ])
  );


  return {
    domain: hostname,
    folder,
    pages
  };
}
