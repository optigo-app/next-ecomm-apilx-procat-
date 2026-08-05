import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveLoginOption } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const LoginOptionComponent = await resolveLoginOption(ACTIVE_THEME);
  return <LoginOptionComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

