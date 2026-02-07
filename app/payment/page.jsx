import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import PaymentComponent from '@/app/theme/fgstore.pro/payment/page.jsx'

export default async function Page() {
  const storeInit = await getStoreInit();
  return <PaymentComponent storeInit={storeInit} />;
}
