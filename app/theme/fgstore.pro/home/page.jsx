
export const dynamic = "force-static";
export const revalidate = 43200; // 12 hours = 12 * 60 * 60


import React from "react";
import { cache } from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
// import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
// import { assetBase } from "@/app/(core)/lib/ServerHelper";
import TopSection from "../TopVideo/TopSection";
import Album from "./Album/Album";



export const metadata = generatePageMetadata(pages["/"], "Procatalog");

const ProcatalogHome = cache(async () => {
  const storeData = await getStoreInit();
  // const { bestsellerBanner, newArrivalBanner, trendingBanner, lookbookBanner } = useHomeBannerImages({ host: assetBase });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <TopSection storeData={storeData} />
      <Album storeinit={storeData}/>
  
    </Box>
  );
});

export default ProcatalogHome;
