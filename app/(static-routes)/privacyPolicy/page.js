import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: PrivacyPolicyComponent } = await import(`@/app/theme/${ACTIVE_THEME}/privacyPolicy/page.js`);
  return <PrivacyPolicyComponent />;
}

