import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();
  const { default: ContinueWithMobileComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/ContinueWithMobile/page.js`);
  return <ContinueWithMobileComponent params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};

export default page;

