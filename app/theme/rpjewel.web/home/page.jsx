import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { headers } from "next/headers";
import React from "react";

export const metadata = generatePageMetadata(pages["/"], "RP Jewels");

const RPJewelsHome = async () => {
  const headersList = await headers();
  const storeData = JSON.parse(headersList.get("x-store-data") || "{}");
  return <div>Hello RP Jewels home page</div>;
};

export default RPJewelsHome;
