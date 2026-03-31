import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export default async function Page({ params, searchParams }) {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: ProductComponent } = await import(`@/app/theme/${ACTIVE_THEME}/product/page.jsx`);
  return <ProductComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
}

