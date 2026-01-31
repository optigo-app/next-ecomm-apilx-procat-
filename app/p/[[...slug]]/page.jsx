import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";



export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/product/page.jsx",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/product/page.jsx",
  },
};


export default async function Page({ params, searchParams }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Product = (await import(themeData.page)).default;
  return <Product params={params} searchParams={searchParams} />;
}
