import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: HomeComponent } = await import(`@/app/theme/${ACTIVE_THEME}/home/page.jsx`);
  return <HomeComponent />;
}

