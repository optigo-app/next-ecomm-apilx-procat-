import { getThemeByDomain } from "../../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveProductDetail } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const DetailComponent = await resolveProductDetail(ACTIVE_THEME);
  return <DetailComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
}

