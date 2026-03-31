import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const { default: AppointmentComponent } = await import(`@/app/theme/${ACTIVE_THEME}/appointment/page.js`);
  return <AppointmentComponent assetBase={assetBase} />;
}

