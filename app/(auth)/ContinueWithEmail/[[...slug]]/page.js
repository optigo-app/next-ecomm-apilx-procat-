import React from "react";
import ContinueWithEmailComponent from "@/app/theme/fgstore.pro/Auth/ContinueWithEmail/page.js";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();
  return <ContinueWithEmailComponent storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
