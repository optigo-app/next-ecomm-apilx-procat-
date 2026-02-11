import { NEXT_APP_WEB } from "./env";

export const domainHtmlMap = {
  "nxt10.optigoapps.com": "sonasons",
  "thereflections.procatalog.in": "saraff",
  "almacarino.procatalog.in": "almacarino",
  "uscreation.procatalog.in": "uscreation",
  "hemratnajewels.procatalog.in": "hemratnajewels",
  "myras.procatalog.in": "myras",
  "fabgold.procatalog.in": "fabgold",
  "glossyjewel.procatalog.in": "glossyjewel",
  "demo.procatalog.in": "sonasons",
  "company.procatalog.in": "sonasons",
  "test.procatalog.in": "sonasons",
  "localhost:5006" : 'sonasons',
  "localhost:8012" : 'sonasons',
  "localhost:8006" : 'sonasons',
  "localhost:3000" : 'sonasons',
  "localhost:4000" : 'sonasons',
  'procatalog.web':'sonasons'

};

const pageFileMap = {
  aboutUs: "aboutUs.html",
  privacy: "PrivacyPolicy.html",
  refund: "refundpolicy.html",
  shipping: "ShippingPolicy.html",
  terms: "TermsPolicy.html",
  styleContent: "ColorTheme.txt",
};

export function getStaticHtmlPages(host) {
  const domain = host || NEXT_APP_WEB;
  const folder = domainHtmlMap[domain];

  const pages = Object.fromEntries(Object.entries(pageFileMap).map(([key, file]) => [key, `public/WebSiteStaticImage/html/${folder}/${file}`]));

  return {
    domain,
    folder,
    pages,
  };
}
