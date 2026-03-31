import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const storeInit = await getStoreInit();
  const { default: PaymentComponent } = await import(`@/app/theme/${ACTIVE_THEME}/payment/page.jsx`);
  return <PaymentComponent storeInit={storeInit} />;
}

