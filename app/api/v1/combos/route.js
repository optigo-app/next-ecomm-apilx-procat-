import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { CommonAPI } from "@/app/(core)/utils/API/CommonAPI/CommonAPI";

// Generic fetcher for combos that works on the server
const fetchCombo = async (mode, funcName, pValue, customerEmail, storeInit) => {
  const body = {
    con: JSON.stringify({ id: "", mode, appuserid: customerEmail ?? "" }),
    f: funcName,
    p: JSON.stringify(pValue),
  };
  return CommonAPI(body, storeInit);
};

// Cached combo fetcher using Next.js unstable_cache
const getAggregatedCombos = unstable_cache(
  async (finalID, storeInit) => {
    console.log(`[ComboCache] Fetching fresh combos for: ${storeInit?.FrontEnd_RegNo}, ID: ${finalID}`);

    const customerEmail = finalID;
    const customerId = finalID;
    const FrontEnd_RegNo = storeInit?.FrontEnd_RegNo;

    const results = {};

    results.metalTypeCombo = await fetchCombo(
      "METALTYPECOMBO",
      "Account (changePassword)",
      { FrontEnd_RegNo, Customerid: customerId },
      customerEmail,
      storeInit
    );

    results.diamondQualityColorCombo = await fetchCombo(
      "DIAMONDQUALITYCOLORCOMBO",
      "Account (changePassword)",
      { FrontEnd_RegNo, Customerid: customerId },
      customerEmail,
      storeInit
    );

    results.MetalColorCombo = await fetchCombo(
      "METALCOLORCOMBO",
      "Account (changePassword)",
      { FrontEnd_RegNo, Customerid: customerId },
      customerEmail,
      storeInit
    );

    results.ColorStoneQualityColorCombo = await fetchCombo(
      "COLORSTONEQUALITYCOLORCOMBO",
      "Account (changePassword)",
      { FrontEnd_RegNo, Customerid: customerId },
      customerEmail,
      storeInit
    );

    results.CurrencyCombo = await fetchCombo(
      "CURRENCYCOMBO",
      "Account (changePassword)",
      { FrontEnd_RegNo, Customerid: customerId },
      customerEmail,
      storeInit
    );

    results.CountryCodeListApi = await fetchCombo(
      "GETCOUNTRYLIST",
      "Account (changePassword)",
      { FrontEnd_RegNo },
      customerEmail,
      storeInit
    );

    return results;
  },
  ['combos-cache'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['combos']
  }
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { finalID, storeInit } = body;
    const data = await getAggregatedCombos(finalID, storeInit);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("Combo API Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
