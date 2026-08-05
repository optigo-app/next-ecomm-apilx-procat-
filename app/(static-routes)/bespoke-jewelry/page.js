import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveBespokeJewelry } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const BespokeJewelry = await resolveBespokeJewelry(ACTIVE_THEME);
  return <BespokeJewelry assetBase={assetBase} />;
}
