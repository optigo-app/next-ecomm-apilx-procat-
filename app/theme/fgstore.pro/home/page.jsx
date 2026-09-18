import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import TopSection from "../TopVideo/TopSection";
import Album from "./Album/Album";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import HandDrawnHeader from "./Header";

export const metadata = generatePageMetadata(pages["/"], "Procatalog");

const ProcatalogHome = async () => {
  const storeInit = await getStoreInit();

  return (
    <div style={{ width: "100%", height: "100%"}}>
      <TopSection assetBase={assetBase} initialBanner={storeInit?.ProCatLogbanner} />
      <HandDrawnHeader/>
      <Album />
    </div>
  );
};

export default ProcatalogHome;
