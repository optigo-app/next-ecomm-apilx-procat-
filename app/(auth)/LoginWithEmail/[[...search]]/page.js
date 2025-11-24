import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";
import { themeMap } from "@/app/(core)/utils/ThemeMap";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const storeInit = await getStoreInit();
  const themeData = themeMap[theme];
  const LoginWithEmail = (await import(`@/app/theme/${themeData.page}/Auth/LoginWithEmail/page.js`)).default;
  return <LoginWithEmail params={params} searchParams={searchParams} storeInit={storeInit} />;
};

export default page;
