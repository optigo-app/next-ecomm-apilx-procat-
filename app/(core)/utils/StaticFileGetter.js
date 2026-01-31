import { NEXT_APP_WEB } from "./env";

export const domainHtmlMap = {
    "nxt10.optigoapps.com": "sonasons",
    "thereflections.procatalog.in": "saraff",
    "almacarino.com": "almacarino",
    "uscreation.com": "uscreation",
};

const pageFileMap = {
    aboutUs: "aboutUs.html",
    privacy: "PrivacyPolicy.html",
    refund: "refundpolicy.html",
    shipping: "ShippingPolicy.html",
    terms: "TermsPolicy.html",
};

export function getStaticHtmlPages() {
    const domain = NEXT_APP_WEB;
    const folder = domainHtmlMap[domain] ?? "default";

    const pages = Object.fromEntries(
        Object.entries(pageFileMap).map(([key, file]) => [
            key,
            `public/WebSiteStaticImage/html/${folder}/${file}`,
        ])
    );

    return {
        domain,
        folder,
        pages,
    };
}
