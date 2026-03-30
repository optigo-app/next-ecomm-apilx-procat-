import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { ACTIVE_THEME } from "@/app/(core)/constants/data";

export default async function Page() {
  const storeInit = await getStoreInit();
  const { default: ConfirmationComponent } = await import(`@/app/theme/${ACTIVE_THEME}/confirmation/page.jsx`);
  return <ConfirmationComponent storeInit={storeInit} />;
}

