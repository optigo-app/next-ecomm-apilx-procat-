import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: AboutUsComponent } = await import(`@/app/theme/${ACTIVE_THEME}/AboutUs/page.js`);
  return <AboutUsComponent />;
}

