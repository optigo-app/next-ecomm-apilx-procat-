import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React from "react";

export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/Auth/ContinueWithEmail/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/Auth/ContinueWithEmail/page.js",
  },
};

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const theme = await getActiveTheme();
  const storeInit = await getStoreInit();
  const themeData = themeMap[theme];
  const ContinueWithEmail = (await import(themeData.page)).default;
  return <ContinueWithEmail storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
