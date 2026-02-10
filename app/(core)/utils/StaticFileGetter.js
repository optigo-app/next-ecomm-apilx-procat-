import { getDomainHtmlMap } from "../config/domainLoader";
import { NEXT_APP_WEB } from "./env";

export const domainHtmlMap = getDomainHtmlMap();

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
