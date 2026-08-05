import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveContinueWithEmail } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const PageComponent = await resolveContinueWithEmail(ACTIVE_THEME);
  return <PageComponent storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
