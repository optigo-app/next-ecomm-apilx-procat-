import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: ShippingPolicyComponent } = await import(`@/app/theme/${ACTIVE_THEME}/shippingPolicy/page.js`);
  return <ShippingPolicyComponent />;
}

