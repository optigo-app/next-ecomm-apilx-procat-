import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import DeliveryComponent from "@/app/theme/fgstore.pro/delivery/page.jsx";

export default async function Page() {
  const storeInit = await getStoreInit();
  return <DeliveryComponent storeInit={storeInit} />;
}
