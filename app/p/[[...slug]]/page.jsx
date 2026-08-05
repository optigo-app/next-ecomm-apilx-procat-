import { getThemeByDomain } from "../../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveProductList } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const ProductComponent = await resolveProductList(ACTIVE_THEME);
  return <ProductComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
}

