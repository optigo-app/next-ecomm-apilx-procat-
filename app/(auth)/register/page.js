import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveRegister } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const storeInit = await getStoreInit();
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const RegisterComponent = await resolveRegister(ACTIVE_THEME);
  return <RegisterComponent storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
