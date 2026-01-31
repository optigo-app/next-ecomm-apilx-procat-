import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";


export const themeMap = {

  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/detail/page.jsx",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/detail/page.jsx",
  },
};


export default async function Page({ params, searchParams }) {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Detail = (await import(themeData.page)).default;
  return <Detail params={params} searchParams={searchParams} />;
}
