import { getThemeByDomain } from "../../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const { default: TermsAndConditionsComponent } = await import(`@/app/theme/${ACTIVE_THEME}/TermsAndConditions/page.js`);
  return <TermsAndConditionsComponent />;
}

