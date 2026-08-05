import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveDelivery } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const storeInit = await getStoreInit();
  const DeliveryComponent = await resolveDelivery(ACTIVE_THEME);
  return <DeliveryComponent storeInit={storeInit} />;
}

