import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { resolveAboutUs } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  console.log(hostname  , "AboutUsComponent")
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const AboutUsComponent = await resolveAboutUs(ACTIVE_THEME);
  return <AboutUsComponent hostname={hostname} />;
}
