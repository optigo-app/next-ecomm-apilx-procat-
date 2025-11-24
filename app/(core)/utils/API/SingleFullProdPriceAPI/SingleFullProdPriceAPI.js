import { CommonAPI } from "../CommonAPI/CommonAPI";

export const SingleFullProdPriceAPI = async (obj, autocode) => {
  const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
  const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));
  const param = JSON.parse(sessionStorage.getItem("menuparams"));
  const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
  const UserEmail = sessionStorage.getItem("registerEmail");

  const GetPriceReq = {
    CurrencyRate: `${storeInit?.CurrencyRate}`,
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
    Customerid: `${loginUserDetail?.id ?? 0}`,
    Laboursetid: `${loginUserDetail?.pricemanagement_laboursetid ?? storeInit?.pricemanagement_laboursetid
      }`,
    diamondpricelistname: `${loginUserDetail?.diamondpricelistname ?? storeInit?.diamondpricelistname
      }`,
    colorstonepricelistname: `${loginUserDetail?.colorstonepricelistname ?? storeInit?.colorstonepricelistname
      }`,
    SettingPriceUniqueNo: `${loginUserDetail?.SettingPriceUniqueNo ?? storeInit?.SettingPriceUniqueNo
      }`,
    // Laboursetid: `${
    //   storeInit?.IsB2BWebsite == 0 && islogin == false
    //     ? storeInit?.pricemanagement_laboursetid
    //     : loginUserDetail?.pricemanagement_laboursetid
    // }`,
    // diamondpricelistname: `${
    //   storeInit?.IsB2BWebsite == 0 && islogin == false
    //     ? storeInit?.diamondpricelistname
    //     : loginUserDetail?.diamondpricelistname
    // }`,
    // colorstonepricelistname: `${
    //   storeInit?.IsB2BWebsite == 0 && islogin == false
    //     ? storeInit?.colorstonepricelistname
    //     : loginUserDetail?.colorstonepricelistname
    // }`,
    // SettingPriceUniqueNo: `${
    //   storeInit?.IsB2BWebsite == 0 && islogin == false
    //     ? storeInit?.SettingPriceUniqueNo
    //     : loginUserDetail?.SettingPriceUniqueNo
    // }`,
    designno: `${obj?.b}`,
    IsFromDesDet: 1,
    AutoCodeList: `${obj?.a}`,
    "WebDiscount": islogin ? `${loginUserDetail?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
  };

  const encodedCombinedValue = btoa(JSON.stringify(GetPriceReq));

  let body = {
    con: `{\"id\":\"Store\",\"mode\":\"getdesignpricelist\",\"appuserid\":\"${UserEmail}\"}`,
    f: "onloadFirstTime (getdesignpricelist)",
    // p: encodedCombinedValue,
    // dp: JSON.stringify(GetPriceReq),
    p: JSON.stringify(GetPriceReq),

  };

  let PriceApiData;

  await CommonAPI(body).then((res) => {
    PriceApiData = res?.Data;
  });

  return PriceApiData;
}