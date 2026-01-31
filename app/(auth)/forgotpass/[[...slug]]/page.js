import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React from "react";



export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/Auth/ForgotPassword/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/Auth/ForgotPassword/page.js",
  },
};


const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const storeInit = await getStoreInit();
  const ForgotPassword = (await import(themeData.page)).default;
  return <ForgotPassword params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};

export default page;
