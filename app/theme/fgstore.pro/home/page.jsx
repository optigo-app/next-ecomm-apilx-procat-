import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import TopSection from "../TopVideo/TopSection";
import Album from "./Album/Album";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export const metadata = generatePageMetadata(pages["/"], "Procatalog");

const ProcatalogHome = async () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <TopSection assetBase={assetBase} />
      <Album />
    </div>
  );
};

export default ProcatalogHome;
