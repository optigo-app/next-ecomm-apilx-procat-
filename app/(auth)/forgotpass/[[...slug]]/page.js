import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveForgotPassword } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const storeInit = await getStoreInit();
  const ForgotPasswordComponent = await resolveForgotPassword(ACTIVE_THEME);
  return <ForgotPasswordComponent params={awaitedParams} searchParams={awaitedSearchParams} storeInit={storeInit} />;
};

export default page;
