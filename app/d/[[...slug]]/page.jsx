import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page({ params, searchParams }) {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: DetailComponent } = await import(`@/app/theme/${ACTIVE_THEME}/detail/page.jsx`);
  return <DetailComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
}

