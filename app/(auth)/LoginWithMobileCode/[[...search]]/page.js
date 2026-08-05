import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveLoginWithMobileCode } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const LoginWithMobileCodeComponent = await resolveLoginWithMobileCode(ACTIVE_THEME);
  return <LoginWithMobileCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
