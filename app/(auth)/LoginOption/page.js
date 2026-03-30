import { ACTIVE_THEME } from "@/app/(core)/constants/data";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: LoginOptionComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/LoginOption/page.js`);
  return <LoginOptionComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

