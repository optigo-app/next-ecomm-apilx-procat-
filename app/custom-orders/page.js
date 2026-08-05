import { getStoreInit, GetUserLoginCookie } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveCustomOrders } from "@/app/(core)/utils/ThemeRouteResolver";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const storeInit = await getStoreInit();
  const userToken = await GetUserLoginCookie();

  if (storeInit?.IsCustomOrder == 0) {
    redirect("/");
  }

  // if (!userToken) {
  //   redirect("/LoginOption");
  // }

  const OrderForm = await resolveCustomOrders(ACTIVE_THEME);
  return <OrderForm storeInit={storeInit} />;
}
