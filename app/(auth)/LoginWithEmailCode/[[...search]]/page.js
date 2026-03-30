import { ACTIVE_THEME } from "@/app/(core)/constants/data";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: LoginWithEmailCodeComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/LoginWithEmailCode/page.js`);
  return <LoginWithEmailCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

