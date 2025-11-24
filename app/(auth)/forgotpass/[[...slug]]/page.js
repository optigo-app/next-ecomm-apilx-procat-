import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import React from "react";


const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
      const storeInit = await getStoreInit();
  
  const ForgotPassword = (await import(`@/app/theme/${themeData.page}/Auth/ForgotPassword/page.js`)).default;
  return <ForgotPassword params={params} searchParams={searchParams} storeInit={storeInit} />;
};

export default page;
