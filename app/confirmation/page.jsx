import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export const themeMap = {
  "fgstore.web": {
    page: "fgstore.web",
  },
  "sonasons.optigoapps.com": {
    page: "fgstore.web",
  },
  "nxt10.optigoapps.com": {
    page: "fgstore.web",
  },
  // Add more themes as needed
};
  
  export default async function Page() {
      const theme = await getActiveTheme();
      const themeData = themeMap[theme];
      const storeInit = await getStoreInit();
      const Confirmation = (await import(`@/app/theme/${themeData.page}/confirmation/page.jsx`)).default;
    return <Confirmation storeInit={storeInit} />;
}
