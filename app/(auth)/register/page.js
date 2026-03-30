import { ACTIVE_THEME } from "@/app/(core)/constants/data";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: RegisterComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/Register/page.js`);
  return <RegisterComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

