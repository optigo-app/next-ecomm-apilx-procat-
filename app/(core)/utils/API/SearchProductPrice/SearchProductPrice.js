import { CommonAPI } from "../CommonAPI/CommonAPI";

export const SearchProductPrice = async ({ searchVar, autocodeList }) => {

  const storeInit = JSON.parse(sessionStorage.getItem("storeInit"))
  const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));

  let data = {
    CurrencyRate: `${loginUserDetail?.CurrencyRate}`,
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
    Customerid: `${loginUserDetail?.id ?? 0}`,
    Laboursetid: `${storeInit?.IsB2BWebsite == 0 && islogin == false
        ? storeInit?.pricemanagement_laboursetid
        : loginUserDetail?.pricemanagement_laboursetid
      }`,
    diamondpricelistname: `${storeInit?.IsB2BWebsite == 0 && islogin == false
        ? storeInit?.diamondpricelistname
        : loginUserDetail?.diamondpricelistname
      }`,
    colorstonepricelistname: `${storeInit?.IsB2BWebsite == 0 && islogin == false
        ? storeInit?.colorstonepricelistname
        : loginUserDetail?.colorstonepricelistname
      }`,
    SettingPriceUniqueNo: `${storeInit?.IsB2BWebsite == 0 && islogin == false
        ? storeInit?.SettingPriceUniqueNo
        : loginUserDetail?.SettingPriceUniqueNo
      }`,
    "Metalid": `${loginUserDetail?.Metalid}`,
    "DiaQCid": `${loginUserDetail?.cmboDiaQCid}`,
    "CsQCid": `${loginUserDetail?.cmboCSQCid}`,
    "SearchKey": `${searchVar}`,
    "AutoCodeList": `${autocodeList}`,
    "WebDiscount": islogin ? `${loginUserDetail?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
  }

  let encData = JSON.stringify(data)

  let body = {
    "con": `{\"id\":\"Store\",\"mode\":\"getdesignpricelist\",\"appuserid\":\"${loginUserDetail?.userid ?? ""}\"}`,
    "f": "onloadFirstTime (getdesignpricelist)",
    // "p": btoa(encData),
    // "dp": encData
    p: encData
  }

  let PriceApiData;

  await CommonAPI(body).then((res) => {
    PriceApiData = res?.Data;
  });

  return PriceApiData;

}
