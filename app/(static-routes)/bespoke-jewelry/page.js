import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: BespokeJewelry } = await import(`@/app/theme/${ACTIVE_THEME}/bespoke-jewelry/page.js`);
  return <BespokeJewelry assetBase={assetBase} />;
}


