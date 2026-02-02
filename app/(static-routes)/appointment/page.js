import AppointmentComponent from "@/app/theme/fgstore.pro/appointment/page.js";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export default async function Page() {
  return <AppointmentComponent assetBase={assetBase} />;
}
