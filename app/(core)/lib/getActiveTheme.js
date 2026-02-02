import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { getDomainInfo } from "../utils/getDomainInfo";

export async function getActiveTheme() {
  const { hostname } = await getDomainInfo();
  
  const cleanHost = hostname.split(":")[0];
  console.log("🚀 ~ getActiveTheme ~ cleanHost:", cleanHost)

  const isLocalhost = cleanHost === "localhost" || cleanHost === "127.0.0.1" || cleanHost.endsWith(".localhost");
  if (isLocalhost) {
    return NEXT_APP_WEB;
  }

  return hostname;
}

// import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
// import { cookies } from "next/headers";
// import { getDomainInfo } from "../utils/getDomainInfo";

// export async function getActiveTheme() {
//   const {hostname, protocol} = await getDomainInfo();

//   console.log(hostname, protocol , "link");
//   const cookieStore = await cookies();
//   const storeData = cookieStore.get("x-store-data");

//   if (!storeData) return NEXT_APP_WEB;

//   try {
//     const parsed = JSON.parse(storeData.value);
//     return parsed?.domain || NEXT_APP_WEB;
//   } catch (e) {
//     return NEXT_APP_WEB;
//   }
// }
