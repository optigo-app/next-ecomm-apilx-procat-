import { WEBSITE_NAME, WEBSITE_URL ,NEXT_APP_WEB } from "@/app/(core)/utils/env";

export function generatePageMetadata(pageData) {
    if (!pageData) return {};

    // Base metadata
    const baseMetadata = {
        title: `${pageData.title} | ${NEXT_APP_WEB}`,
        description: pageData.description || "",
        keywords: pageData.keywords || "",
        authors: [{ name: "Optigo Apps" }],
        alternates: { canonical: pageData.url || WEBSITE_URL },
        metadataBase: new URL(WEBSITE_URL),
        icons: {
            icon: [
                { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
            ],
            apple: "/favicon.ico",
            shortcut: "/favicon.ico",
        },
        publisher: "Optigoapps",

        // ✅ Robots meta tags
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
            title: `${pageData.title} | ${WEBSITE_NAME}`,
            description: pageData.description || "",
            url: pageData.url || WEBSITE_URL,
            siteName: WEBSITE_NAME,
            type: "website",
            locale: "en_IN",
            images: pageData.image
                ? [
                    {
                        url: pageData.image,
                        width: 1200,
                        height: 630,
                        alt: `${pageData.title} - ${WEBSITE_NAME}`,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${pageData.title} | ${WEBSITE_NAME}`,
            description: pageData.description || "",
            images: pageData.image ? [pageData.image] : [],
            creator: "@OptigoApps",
        },
        additionalScripts: [], // Placeholder for structured data
    };

    return baseMetadata;
}
