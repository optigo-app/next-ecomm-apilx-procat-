import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page({ params, searchParams }) {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: ProductComponent } = await import(`@/app/theme/${ACTIVE_THEME}/product/page.jsx`);
  return <ProductComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
}

