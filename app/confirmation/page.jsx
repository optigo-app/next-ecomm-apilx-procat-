import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import ConfirmationComponent from "@/app/theme/fgstore.pro/confirmation/page.jsx";


export default async function Page() {
  const storeInit = await getStoreInit();
  return <ConfirmationComponent storeInit={storeInit} />;
}
