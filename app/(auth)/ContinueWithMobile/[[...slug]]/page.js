import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import ContinueWithMobileComponent from "@/app/theme/fgstore.pro/Auth/ContinueWithMobile/page.js";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();
  return <ContinueWithMobileComponent params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};

export default page;
