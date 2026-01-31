import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/Auth/LoginWithEmail/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/Auth/LoginWithEmail/page.js",
  },
};

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const theme = await getActiveTheme();
  const storeInit = await getStoreInit();
  const themeData = themeMap[theme];
  const LoginWithEmail = (await import(themeData.page)).default;
  return <LoginWithEmail params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};

export default page;
