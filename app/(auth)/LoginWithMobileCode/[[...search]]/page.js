import { getThemeByDomain } from "../../../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: LoginWithMobileCodeComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/LoginWithMobileCode/page.js`);
  return <LoginWithMobileCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

