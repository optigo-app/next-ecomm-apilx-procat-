import React from "react";
import OrderForm from "@/app/theme/fgstore.pro/CustomOrder";
import { getStoreInit, GetUserLoginCookie } from "../(core)/utils/GlobalFunctions/GlobalFunctions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const storeInit = await getStoreInit();
  const userToken = await GetUserLoginCookie();

  if (storeInit?.IsCustomOrder == 0) {
    redirect("/");
  }

  // if (!userToken) {
  //   redirect("/LoginOption");
  // }

  return <OrderForm storeInit={storeInit} />;
};
