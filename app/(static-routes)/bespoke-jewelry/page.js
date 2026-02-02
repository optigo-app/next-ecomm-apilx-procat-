import { assetBase } from "@/app/(core)/lib/ServerHelper";
import BespokeJewelry from "@/app/theme/fgstore.pro/bespoke-jewelry/page.js";

export default async function Page() {
  return <BespokeJewelry assetBase={assetBase} />;
}

