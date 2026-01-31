import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/appointment/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/appointment/page.js",
  },
};

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];

  const Appointment = (await import(themeData.page)).default;
  return <Appointment assetBase={assetBase} />;
}
