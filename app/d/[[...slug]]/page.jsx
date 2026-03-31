import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export default async function Page({ params, searchParams }) {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: DetailComponent } = await import(`@/app/theme/${ACTIVE_THEME}/detail/page.jsx`);
  return <DetailComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
}

