import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { getThemeByDomain } from "./(core)/constants/data";
import { resolveHome } from "@/app/(core)/utils/ThemeRouteResolver";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const HomeComponent = await resolveHome(ACTIVE_THEME);
  return <HomeComponent />;
}

