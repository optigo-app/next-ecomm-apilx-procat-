import { getThemeByDomain } from "./(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  console.log('ACTIVE_THEME: ', ACTIVE_THEME);
  const { default: HomeComponent } = await import(`@/app/theme/${ACTIVE_THEME}/home/page.jsx`);
  return <HomeComponent />;
}

