import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/refundpolicy/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/refundpolicy/page.js",
  },
};

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const RefundPolicy = (await import(themeData.page)).default;
  return <RefundPolicy />;
}
