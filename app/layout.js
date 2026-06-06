import { Poppins } from "next/font/google";
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
import fs from "fs";
import path from "path";

// Force dynamic rendering per-request so generateMetadata always reads the
// correct hostname from request headers. Without this, Next.js may cache the
// metadata result from one domain (e.g. francisdiamonds) and serve it to
// another domain (e.g. sakungems).
export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const DEFAULT_JEWELRY_DESCRIPTION = "Discover timeless jewelry crafted with precision and elegance. Explore gold, diamond, and silver collections designed for everyday wear and special occasions, with trusted quality and exceptional craftsmanship.";
const DEFAULT_JEWELRY_KEYWORDS = "jewelry online, gold jewelry, diamond jewelry, silver jewelry, fine jewelry, bridal jewelry, earrings, rings, necklaces, bracelets, luxury jewelry, handcrafted jewelry";


const FrancisDiamondDefaultMeta = {
  title: "Francis Diamonds | Diamond Jewellery Manufacturer & Wholesale Jewellery Catalogue",
  description: "	Explore premium diamond jewellery collections from Francis           			Diamonds, a trusted manufacturer of elegant and modern 				diamond jewellery designs.",
  keywords: "Francis Diamonds, Diamond Jewellery Manufacturer, Wholesale Jewellery Catalogue, Diamond Jewellery Designs",
  author: "Francis Diamonds",
};


const SakungemsDefaultMeta = {
  title: "Sakungems | Gemstone Jewellery Manufacturer & Wholesale Jewellery Catalogue",
  description: "	Explore premium gemstone jewellery collections from Sakungems           			manufacturer of elegant and modern gemstone jewellery designs.",
  keywords: "Sakungems, Gemstone Jewellery Manufacturer, Wholesale Jewellery Catalogue, Gemstone Jewellery Designs",
  author: "Sakungems",
};

// 'sakungems.procatalog.in'
// 'francisdiamonds.procatalog.in'
export async function generateMetadata() {
  const storeInit = await getStoreInit();
  const { hostname, protocol, fullUrl } = await getDomainInfo();
  // const MetaImage = fullUrl + '/meta_preview_image.png' || fullUrl + '/MetaShareImage.jpg'
  console.log(hostname, "metadata")
  let defaultMeta;
  let MetaImage;
  if (hostname === 'sakungems.procatalog.in') {
    console.log("sakungems", hostname)
    defaultMeta = SakungemsDefaultMeta;
    MetaImage = fullUrl + '/MetaShareImage.jpg';
  } else if (hostname === 'francisdiamonds.procatalog.in') {
    console.log("francisdiamonds", hostname)
    defaultMeta = FrancisDiamondDefaultMeta;
    MetaImage = fullUrl + '/meta_preview_image.png'
  } else {
    console.log("else", hostname)
    defaultMeta = {
      description: DEFAULT_JEWELRY_DESCRIPTION,
      keywords: DEFAULT_JEWELRY_KEYWORDS,
    };
    MetaImage = fullUrl + '/MetaShareImage.jpg';
  }

  return generatePageMetadata({
    title: storeInit?.ufcc,
    description: defaultMeta.description || DEFAULT_JEWELRY_DESCRIPTION,
    keywords: defaultMeta.keywords || DEFAULT_JEWELRY_KEYWORDS,
    ogImage: storeInit?.ogImage,
    ufcc: storeInit?.ufcc,
    websiteName: storeInit?.BrowserTitle,
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
  const ht = getStaticHtmlPages(hostname);
  const filePath = path.join(process.cwd(), ht.pages.styleContent);
  const styleContent = await fs.promises.readFile(filePath, "utf-8");

  // Dynamically load theme-specific components
  const [{ default: LayoutComponent }, { default: StyleInjector }] = await Promise.all([
    import(`@/app/theme/${ACTIVE_THEME}/layout.jsx`),
    import(`@/app/theme/${ACTIVE_THEME}/StyleInjector.jsx`),
  ]);

  return (
    <>
      <html lang="en">
        <SWRegistration />
        <EmotionRegistry>
          <StyleInjector styleContent={styleContent} />
          <body className={`${poppins.variable}`}>
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

