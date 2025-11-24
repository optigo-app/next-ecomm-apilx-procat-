import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";


  export default async function Page() {
    const theme = await getActiveTheme();
    const themeData = themeMap[theme];
    const storeInit = await getStoreInit();
    const Delivery = (await import(`@/app/theme/${themeData.page}/delivery/page.jsx`)).default;
    return <Delivery storeInit={storeInit} />;
}
