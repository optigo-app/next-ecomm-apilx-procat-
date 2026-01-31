import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/privacyPolicy/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/privacyPolicy/page.js",
  },
};

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const PrivacyPolicy = (await import(`${themeData.page}`)).default;
  return <PrivacyPolicy />;
}
