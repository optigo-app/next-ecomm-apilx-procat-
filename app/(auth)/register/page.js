import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { getThemeByDomain } from "../../(core)/constants/data";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";

const page = async ({ params, searchParams }) => {
  const { hostname } = await getDomainInfo();
  const ACTIVE_THEME = getThemeByDomain(hostname);
    const storeInit = await getStoreInit();
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  const { default: RegisterComponent } = await import(`@/app/theme/${ACTIVE_THEME}/Auth/Register/page.js`);
  return <RegisterComponent storeInit={storeInit} params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;

