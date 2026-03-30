import { ACTIVE_THEME } from "@/app/(core)/constants/data";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: LoginWithMobileCodeComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/LoginWithMobileCode/page.js`);
  return <LoginWithMobileCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

