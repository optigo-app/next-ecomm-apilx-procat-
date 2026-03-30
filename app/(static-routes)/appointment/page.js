import { assetBase } from "@/app/(core)/lib/ServerHelper";
import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const { default: AppointmentComponent } = await import(`@/app/theme/${ACTIVE_THEME}/appointment/page.js`);
  return <AppointmentComponent assetBase={assetBase} />;
}

