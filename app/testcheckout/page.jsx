import React from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import TestCheckoutMain from "./components/TestCheckoutMain";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | My Shopping Bag",
  description: "Review your shopping bag, manage delivery address and complete order.",
};

export default async function TestCheckoutPage() {
  const storeinit = await getStoreInit();
  return <TestCheckoutMain storeinit={storeinit} />;
}
