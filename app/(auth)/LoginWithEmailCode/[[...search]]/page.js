import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveLoginWithEmailCode } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const LoginWithEmailCodeComponent = await resolveLoginWithEmailCode(ACTIVE_THEME);
  return <LoginWithEmailCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
