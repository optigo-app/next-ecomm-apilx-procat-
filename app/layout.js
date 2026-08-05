import { Quicksand } from "next/font/google";
// import { Poppins,DM_Sans ,Quicksand } from "next/font/google";
import { getCompanyInfoData, getMyAccountFlags, getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { MasterProvider } from "@/app/(core)/contexts/MasterProvider";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";
import { EmotionRegistry } from "@/app/(core)/contexts/EmotionRegistry";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { StoreProvider } from "@/app/(core)/contexts/StoreProvider";
import { AuthProvider } from "@/app/(core)/contexts/AuthProvider";
import SWRegistration from "./components/SWRegistration";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { getThemeByDomain } from "./(core)/constants/data";
import "./globals.css";

export const dynamic = "force-dynamic";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-poppins",
//   display: "swap",
// });

// const dm_sans = DM_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-dm-sans",
//   display: "swap",
// })

const quick_sand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const DEFAULT_JEWELRY_DESCRIPTION = "Discover timeless jewelry crafted with precision and elegance. Explore gold, diamond, and silver collections designed for everyday wear and special occasions, with trusted quality and exceptional craftsmanship.";
const DEFAULT_JEWELRY_KEYWORDS = "jewelry online, gold jewelry, diamond jewelry, silver jewelry, fine jewelry, bridal jewelry, earrings, rings, necklaces, bracelets, luxury jewelry, handcrafted jewelry";

const DOMAIN_METADATA_CONFIG = {
  "sakungems.procatalog.in": {
    defaultMeta: {
      title: "Sakungems | Gemstone Jewellery Manufacturer & Wholesale Jewellery Catalogue",
      description: "Explore premium gemstone jewellery collections from Sakungems manufacturer of elegant and modern gemstone jewellery designs.",
      keywords: "Sakungems, Gemstone Jewellery Manufacturer, Wholesale Jewellery Catalogue, Gemstone Jewellery Designs",
      author: "Sakungems",
    },
    metaImageFile: "/ogsakungems.png",
  },
  "francisdiamonds.procatalog.in": {
    defaultMeta: {
      title: "Francis Diamonds | Diamond Jewellery Manufacturer & Wholesale Jewellery Catalogue",
      description: "Explore premium diamond jewellery collections from Francis Diamonds, a trusted manufacturer of elegant and modern diamond jewellery designs.",
      keywords: "Francis Diamonds, Diamond Jewellery Manufacturer, Wholesale Jewellery Catalogue, Diamond Jewellery Designs",
      author: "Francis Diamonds",
    },
    metaImageFile: "/og_francis.png",
  },
};

// 'sakungems.procatalog.in'
// 'francisdiamonds.procatalog.in'
export async function generateMetadata() {
  const storeInit = await getStoreInit();
  const { hostname, fullUrl } = await getDomainInfo();

  const config = DOMAIN_METADATA_CONFIG[hostname] || {
    defaultMeta: {
      description: DEFAULT_JEWELRY_DESCRIPTION,
      keywords: DEFAULT_JEWELRY_KEYWORDS,
      author: storeInit?.ufcc || "Procatalog",
    },
    metaImageFile: "/MetaShareImage.jpg",
  };

  const defaultMeta = config.defaultMeta;
  const MetaImage = `${fullUrl}${config.metaImageFile}`;

  return generatePageMetadata({
    title: storeInit?.ufcc,
    description: defaultMeta.description || DEFAULT_JEWELRY_DESCRIPTION,
    keywords: defaultMeta.keywords || DEFAULT_JEWELRY_KEYWORDS,
    ogImage: storeInit?.ogImage,
    ufcc: storeInit?.ufcc,
    websiteName: storeInit?.BrowserTitle,
    author: defaultMeta.author || storeInit?.ufcc || "Procatalog",
    publishedTime: "2026-06-16T00:00:00.000Z",
    icons: {
      icon: storeInit?.favicon,
      shortcut: storeInit?.favicon,
      apple: storeInit?.favicon,
    },
  }, fullUrl, MetaImage);
}

export default async function RootLayout({ children }) {
  const companyInfo = await getCompanyInfoData();
  const storeInit = await getStoreInit();
  const myAccountFlags = await getMyAccountFlags();
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);

  const [{ default: LayoutComponent }, { default: StyleInjector }] = await Promise.all([
    import(`@/app/theme/${ACTIVE_THEME}/layout.jsx`),
    import(`@/app/theme/${ACTIVE_THEME}/StyleInjector.jsx`),
  ]);

  return (
    <>
      <html lang="en">
        <head>
          <link rel="stylesheet" href={`/api/theme-style?host=${hostname}&v=${storeInit?.token || ""}`} />
        </head>
        <SWRegistration />
        <EmotionRegistry>
          <body className={`${quick_sand.variable}`}>
            {/* <StyleInjector styleContent="" /> */}
            <MasterProvider getCompanyInfoData={companyInfo} getStoreInit={storeInit} getMyAccountFlags={myAccountFlags}>
              <StoreProvider storeinit={storeInit}>
                <AuthProvider storeInit={storeInit}>
                  <LayoutComponent >{children}</LayoutComponent>
                </AuthProvider>
              </StoreProvider>
            </MasterProvider>
          </body>
        </EmotionRegistry>
      </html>
    </>
  );
}

