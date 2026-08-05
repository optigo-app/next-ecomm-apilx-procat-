import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolvePayment } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const storeInit = await getStoreInit();
  const PaymentComponent = await resolvePayment(ACTIVE_THEME);
  return <PaymentComponent storeInit={storeInit} />;
}

