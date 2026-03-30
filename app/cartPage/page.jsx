import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page({ params, searchParams }) {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: CartComponent } = await import(`@/app/theme/${ACTIVE_THEME}/cart/page.jsx`);
  return <CartComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
}

