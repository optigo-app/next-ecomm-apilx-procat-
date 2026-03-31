import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "../../../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const { default: PageComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/ContinueWithEmail/page.js`);

  return <PageComponent storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;


