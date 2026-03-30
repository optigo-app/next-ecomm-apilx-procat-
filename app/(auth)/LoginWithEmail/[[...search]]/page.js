import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { ACTIVE_THEME } from "@/app/(core)/constants/data";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();
  const { default: LoginWithEmailComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/LoginWithEmail/page.js`);
  return <LoginWithEmailComponent params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};

export default page;

