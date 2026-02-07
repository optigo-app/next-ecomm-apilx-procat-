import { getCompanyInfoData, getMyAccountFlags, getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { MasterProvider } from "@/app/(core)/contexts/MasterProvider";
import { getStaticHtmlPages } from "./(core)/utils/StaticFileGetter";
import { EmotionRegistry } from "./(core)/contexts/EmotionRegistry";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import LayoutComponent from "@/app/theme/fgstore.pro/layout.jsx";
import { StoreProvider } from "./(core)/contexts/StoreProvider";
import { AuthProvider } from "./(core)/contexts/AuthProvider";
import StyleInjector from "./theme/fgstore.pro/StyleInjector";
import { Poppins } from "next/font/google";
import path from "path";
import "./globals.css";
import fs from "fs";
import { getDomainInfo } from "./(core)/utils/getDomainInfo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const DEFAULT_JEWELRY_DESCRIPTION = "Discover timeless jewelry crafted with precision and elegance. Explore gold, diamond, and silver collections designed for everyday wear and special occasions, with trusted quality and exceptional craftsmanship.";
const DEFAULT_JEWELRY_KEYWORDS = "jewelry online, gold jewelry, diamond jewelry, silver jewelry, fine jewelry, bridal jewelry, earrings, rings, necklaces, bracelets, luxury jewelry, handcrafted jewelry";

export async function generateMetadata() {
  const storeInit = await getStoreInit();

  return generatePageMetadata({
    title: storeInit?.ufcc,
    description: DEFAULT_JEWELRY_DESCRIPTION,
    keywords: DEFAULT_JEWELRY_KEYWORDS,
    ogImage: storeInit?.ogImage,
    ufcc: storeInit?.ufcc,
    websiteName: storeInit?.BrowserTitle,
    icons: {
      icon: storeInit?.favicon,
      shortcut: storeInit?.favicon,
      apple: storeInit?.favicon,
    },
  });
}

export default async function RootLayout({ children }) {
  const companyInfo = await getCompanyInfoData();
  const storeInit = await getStoreInit();
  const myAccountFlags = await getMyAccountFlags();
  const { hostname } = await getDomainInfo();
  const ht = getStaticHtmlPages(hostname);
  const filePath = path.join(process.cwd(), ht.pages.styleContent);
  const styleContent = await fs.promises.readFile(filePath, "utf-8");

  return (
    <>
      <html lang="en">
        <EmotionRegistry>
          <StyleInjector styleContent={styleContent} />
          <body className={`${poppins.variable}`}>
            <MasterProvider getCompanyInfoData={companyInfo} getStoreInit={storeInit} getMyAccountFlags={myAccountFlags}>
              <StoreProvider>
                <AuthProvider storeInit={storeInit}>
                  <LayoutComponent>{children}</LayoutComponent>
                </AuthProvider>
              </StoreProvider>
            </MasterProvider>
          </body>
        </EmotionRegistry>
      </html>
    </>
  );
}
