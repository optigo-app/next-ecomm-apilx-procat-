import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";


export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/payment/page.jsx",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/payment/page.jsx",
  },
};



export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const storeInit = await getStoreInit();
  const Payment = (await import(themeData.page)).default;
  return <Payment storeInit={storeInit} />;
}
