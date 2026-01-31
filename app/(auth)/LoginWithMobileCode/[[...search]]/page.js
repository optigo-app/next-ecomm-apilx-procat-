import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";


export const themeMap = {
  "nxt10.optigoapps.com": {
    page: "@/app/theme/fgstore.pro/Auth/LoginWithMobileCode/page.js",
  },
  "thereflections.procatalog.in": {
    page: "@/app/theme/fgstore.pro/Auth/LoginWithMobileCode/page.js",
  },
};


const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const LoginWithMobileCode = (await import(themeData.page)).default;
  return <LoginWithMobileCode params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
