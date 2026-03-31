import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: LoginWithEmailCodeComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/LoginWithEmailCode/page.js`);
  return <LoginWithEmailCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

