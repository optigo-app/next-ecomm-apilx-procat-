import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: ContactUsComponent } = await import(`@/app/theme/${ACTIVE_THEME}/contactUs/page.js`);
  return <ContactUsComponent />;
}

