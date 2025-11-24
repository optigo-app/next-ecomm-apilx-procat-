import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "../(core)/utils/ThemeMap";

  export default async function Page({ params, searchParams }) {
    const theme = await getActiveTheme();
    const themeData = themeMap[theme];
    const Cart = (await import(`@/app/theme/${themeData.page}/cart/page.jsx`)).default;
    return <Cart params={params} searchParams={searchParams} />;
}
