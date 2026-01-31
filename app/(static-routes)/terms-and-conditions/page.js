import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/TermsAndConditions/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/TermsAndConditions/page.js",
  },
};

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const AboutUs = (await import(themeData.page)).default;
  return <AboutUs />;
}
