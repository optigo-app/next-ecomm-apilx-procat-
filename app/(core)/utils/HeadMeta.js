import { WEBSITE_NAME, WEBSITE_URL, NEXT_APP_WEB } from "@/app/(core)/utils/env";


export function getValidUrl(website) {
    if (!website) return undefined;
    try {
        return new URL(website);
    } catch {
        try {
            return new URL(`https://${website}`);
        } catch {
            return undefined;
        }
    }
}


export function generatePageMetadata(pageData, url, MetaImage) {
    console.log(MetaImage, "MetaImage")

    if (!pageData) return {};
    const isSakunGems = url && String(url).includes('sakungems');
    const pageTitle = isSakunGems
        ? (pageData.websiteName || pageData.title || "")
        : `${pageData.title} | ${pageData.websiteName}`;

    const baseMetadata = {
        title: pageTitle,
        description: pageData.description || "",
        keywords: pageData.keywords || "",
        authors: [{ name: pageData.author || pageData.ufcc }],
        alternates: { canonical: getValidUrl(pageData?.websiteName) },
        metadataBase: getValidUrl(pageData?.websiteName),
        icons: {
            icon: pageData.icons?.icon || [
                { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
            ],
            apple: pageData.icons?.apple || "/favicon.ico",
            shortcut: pageData.icons?.shortcut || "/favicon.ico",
        },
        publisher: NEXT_APP_WEB,
        websiteName: getValidUrl(pageData.websiteName),
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            title: pageTitle,
            description: pageData.description || "",
            url: getValidUrl(pageData.websiteName),
            siteName: pageData.websiteName,
            type: "article",
            publishedTime: pageData.publishedTime || "2026-06-16T00:00:00.000Z",
            authors: pageData.author ? [pageData.author] : (pageData.ufcc ? [pageData.ufcc] : []),
            locale: "en_IN",
            images:
                [
                    {
                        url: MetaImage,
                        width: 1200,
                        height: 630,
                        alt: `${pageData.title} - ${pageData.websiteName}`,
                    },
                ]
        },
        twitter: {
            card: "summary_large_image",
            title: pageTitle,
            description: pageData.description || "",
            images: MetaImage ? [MetaImage] : [],
            creator: NEXT_APP_WEB,
        },
        additionalScripts: [],
    };

    return baseMetadata;
}
