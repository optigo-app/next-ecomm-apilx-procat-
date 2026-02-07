import { CommonAPI } from "../CommonAPI/CommonAPI";

export const getMemoReturnData = async (CurrencyRate, FrontEnd_RegNo, customerid, data) => {
  try {
    const combinedValue = JSON.stringify({
      CurrencyRate: CurrencyRate,
      FrontEnd_RegNo: `${FrontEnd_RegNo}`,
      Customerid: `${customerid}`,
    });
    const encodedCombinedValue = btoa(combinedValue);
    const encodedCombinedValue2 = (combinedValue);
    const body = {
      con: `{\"id\":\"Store\",\"mode\":\"getmemoreport\",\"appuserid\":\"${data?.userid}\"}`,
      f: "zen (cartcount)",
      // p: encodedCombinedValue,
      // dp: encodedCombinedValue2,
      "p": encodedCombinedValue2
    };
    const response = await CommonAPI(body);
    return response;
  } catch (error) {
    console.log(error);
  }
}