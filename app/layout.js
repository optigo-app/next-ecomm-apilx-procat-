import { Poppins } from "next/font/google";
import "./globals.css";
import { pages } from "@/app/(core)/utils/pages";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { MasterProvider } from "@/app/(core)/contexts/MasterProvider";
import { getCompanyInfoData, getMyAccountFlags, getStoreInit, GetUserLoginCookie, GetVistitorId } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getActiveTheme } from "./(core)/lib/getActiveTheme";
import { StoreProvider } from "./(core)/contexts/StoreProvider";
import { themeMap } from "./(core)/utils/ThemeMap";
import Test from "./test";
import { AuthProvider } from "./(core)/contexts/AuthProvider";
import { EmotionRegistry } from "./(core)/contexts/EmotionRegistry";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = generatePageMetadata(pages["/"]);

export default async function RootLayout({ children }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Layout = (await import(`@/app/theme/${themeData.page}/layout.jsx`)).default;
  const companyInfo = await getCompanyInfoData();
  const storeInit = await getStoreInit();
  console.log("🚀 ~ RootLayout ~ storeInit:", storeInit)
  const myAccountFlags = await getMyAccountFlags();
  const VistitorId = await GetVistitorId();
  const UserLoginCookie = await GetUserLoginCookie();

  return (
    <html lang="en">
      <EmotionRegistry>
        <body className={`${poppins.variable}`}>
          <Test />
          <MasterProvider getCompanyInfoData={companyInfo} getStoreInit={storeInit} getMyAccountFlags={myAccountFlags}>
            <StoreProvider>
              <AuthProvider storeInit={storeInit}>
                <Layout>{children}</Layout>
              </AuthProvider>
            </StoreProvider>
          </MasterProvider>
        </body>
      </EmotionRegistry>
    </html>
  );
}
