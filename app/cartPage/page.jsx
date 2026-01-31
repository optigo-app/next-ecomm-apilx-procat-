import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";



export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/cart/page.jsx",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/cart/page.jsx",
  },
};


export default async function Page({ params, searchParams }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Cart = (await import(themeData.page)).default;
  return <Cart params={params} searchParams={searchParams} />;
}
