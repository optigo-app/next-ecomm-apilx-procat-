import { CommonAPI } from "../CommonAPI/CommonAPI";


export const SearchProduct = async (searchVar) => {
  let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
  let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

  const data = {
    PackageId: `${loginInfo?.PackageId ?? storeinit?.PackageId}`,
    FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
    Customerid: `${loginInfo?.id ?? 0}`,
    SearchKey: `${searchVar}`,
    CurrencyRate: `${loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate}`
  };

  let encData = JSON.stringify(data)

  let body = {
    con: `{\"id\":\"\",\"mode\":\"GETPRODUCTLIST\",\"appuserid\":\"${loginInfo?.userid ?? ""}\"}`,
    f: "(searchProduct)",
    // p:btoa(encData),
    // dp: encData,
    p: encData
  };

  let pdList = [];
  let pdResp = [];

  await CommonAPI(body).then((res) => {
    if (res) {
      pdList = res?.Data.rd;
      pdResp = res?.Data
    }
  });

  return { pdList, pdResp }
}

