import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: RefundPolicyComponent } = await import(`@/app/theme/${ACTIVE_THEME}/refundpolicy/page.js`);
  return <RefundPolicyComponent />;
}

