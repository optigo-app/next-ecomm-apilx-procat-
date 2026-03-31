import { getThemeByDomain } from "@/app/(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

export default async function Page() {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
  const { default: ShippingPolicyComponent } = await import(`@/app/theme/${ACTIVE_THEME}/shippingPolicy/page.js`);
  return <ShippingPolicyComponent />;
}

