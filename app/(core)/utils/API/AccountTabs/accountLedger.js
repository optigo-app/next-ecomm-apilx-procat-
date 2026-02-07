import { CommonAPI } from "../CommonAPI/CommonAPI";


export const getAccountLedgerData = async (storeinit, loginInfo, UserEmail) => {
  try {
    let EncodeData = {
      FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
      Customerid: `${loginInfo?.id}`,
    };

    const encodedCombinedValue = btoa(JSON.stringify(EncodeData));

    const body_currencycombo = {
      con: `{\"id\":\"Store\",\"mode\":\"CURRENCYCOMBO\",\"appuserid\":\"${UserEmail}\"}`,
      f: "m-test2.orail.co.in (getcategorysize)",
      p: `${encodedCombinedValue}`,
    };

    const response = await CommonAPI(body_currencycombo);


    const CurrencyRate = response?.Data?.rd[0]?.CurrencyRate;
    // const CurrencySymbol = response?.Data?.rd[0]?.Currencysymbol;
    const CurrencySymbol = response?.Data?.rd[0]?.Currencycode;
    const forendcode = { "CurrencyRate": `${CurrencyRate}`, "FrontEnd_RegNo": `${storeinit?.FrontEnd_RegNo}`, "Customerid": `${loginInfo?.id}` };

    const encodedCombinedValue2 = btoa(JSON.stringify(forendcode));
    const encodedCombinedValue3 = (JSON.stringify(forendcode));

    const body = {
      "con": "{\"id\":\"Store\",\"mode\":\"getledger\",\"appuserid\":\"nimesh@ymail.in\"}",
      "f": "zen (cartcount)",
      "p": encodedCombinedValue3,
      // "p":`${encodedCombinedValue2}`,
      // "dp":`${encodedCombinedValue3}`
    }

    const response2 = await CommonAPI(body);

    let res = {
      response2: response2,
      CurrencySymbol: CurrencySymbol,
      CurrencyRate: CurrencyRate
    }

    return res;

  } catch (error) {
    console.log(error);
  }
}