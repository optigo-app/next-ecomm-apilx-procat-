import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI"


export const FilterListAPI = async (mainData, visiterId) => {

  let storeinit = window.__STORE_INIT__ || getSession("storeInit")
  let loginInfo = getSession("loginUserDetail")
  let menuparams = getSession("menuparams")
  let userEmail = getSession("registerEmail")

  const islogin = getSession("LoginUser") ?? false;

  const customerId = (storeinit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? visiterId : loginInfo?.id ?? 0;
  const customerEmail = (storeinit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? visiterId : loginInfo?.userid ?? "";

  let MenuParams = {};

  let serachVar = ""

  if (Array.isArray(mainData)) {
    if (mainData?.length > 0) {
      Object.values(mainData[0]).forEach((ele, index) => {
        let keyName = `FilterKey${index === 0 ? '' : index}`;
        MenuParams[keyName] = ele.replace(/%20/g, ' ')
      })

      Object.values(mainData[1]).forEach((ele, index) => {
        let keyName = `FilterVal${index === 0 ? '' : index}`;
        MenuParams[keyName] = ele.replace(/%20/g, ' ')
      })
    }
  } else {
    if (mainData !== "") {

      const [prefix, value] = mainData?.split("=") || [];

      const safeAtob = (str) => {
        if (!str || str === "undefined" || str === "null") return "";
        try {
          return atob(str);
        } catch (e) {
          return "";
        }
      };

      if (prefix === "S") {
        try {
          const decoded = safeAtob(value);
          serachVar = decoded ? JSON.parse(decoded) : "";
        } catch (e) {
          console.error("Error decoding searchVar:", e);
        }
      } else if (prefix === "A") {
        try {
          const decodedValue = safeAtob(value);
          if (decodedValue?.split("=")[0] === "AlbumName") {
            MenuParams.FilterKey = decodedValue.split("=")[0];
            MenuParams.FilterVal = decodedValue.split("=")[1];
          } else {
            MenuParams.FilterKey = decodedValue;
            MenuParams.FilterVal = decodedValue;
          }
        } catch (e) {
          console.error("Error decoding album data:", e);
        }
      } else if (prefix === "SK" || prefix === "SecurityKey") {
        // Do nothing or handle as needed, but don't atob
      } else if (mainData !== "") {
        // Fallback for legacy calls that might pass raw base64 without prefix
        try {
          const decoded = safeAtob(mainData);
          if (decoded && decoded?.split("=")[0] === "AlbumName") {
            MenuParams.FilterKey = decoded.split("=")[0];
            MenuParams.FilterVal = decoded.split("=")[1];
          } else if (decoded) {
            MenuParams.FilterKey = decoded;
            MenuParams.FilterVal = decoded;
          } else {
            // If decoding failed or returned empty, treat as raw value
            MenuParams.FilterKey = mainData;
            MenuParams.FilterVal = mainData;
          }
        } catch (e) {
          // If not base64, treat as raw value
          MenuParams.FilterKey = mainData;
          MenuParams.FilterVal = mainData;
        }
      }
    }
  }

  const data = {
    "PackageId": loginInfo?.PackageId ?? storeinit?.PackageId ?? "",
    "autocode": "",
    "FrontEnd_RegNo": storeinit?.FrontEnd_RegNo ?? "",
    "Customerid": customerId ?? 0,
    "FilterKey": MenuParams?.FilterKey ?? "",
    "FilterVal": MenuParams?.FilterVal ?? "",
    "FilterKey1": MenuParams?.FilterKey1 ?? "",
    "FilterVal1": MenuParams?.FilterVal1 ?? "",
    "FilterKey2": MenuParams?.FilterKey2 ?? "",
    "FilterVal2": MenuParams?.FilterVal2 ?? "",
    SearchKey: serachVar?.b ?? "",
    CurrencyRate: loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate ?? "",
    DomainForNo: storeinit?.DomainForNo ?? ""
  }
  // const data = {
  //   "PackageId": `${loginInfo?.PackageId ?? storeinit?.PackageId}`,
  //   "autocode": "",
  //   "FrontEnd_RegNo": `${storeinit?.FrontEnd_RegNo}`,
  //   "Customerid": `${customerId ?? 0}`,
  //   "FilterKey": `${MenuParams?.FilterKey ?? ""}`,
  //   "FilterVal": `${MenuParams?.FilterVal ?? ""}`,
  //   "FilterKey1": `${MenuParams?.FilterKey1 ?? ""}`,
  //   "FilterVal1": `${MenuParams?.FilterVal1 ?? ""}`,
  //   "FilterKey2": `${MenuParams?.FilterKey2 ?? ""}`,
  //   "FilterVal2": `${MenuParams?.FilterVal2 ?? ""}`,
  //   SearchKey: `${serachVar?.b ?? ""}`,
  //   CurrencyRate: `${loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate}`,
  //   DomainForNo: `${storeinit?.DomainForNo ?? ""}`
  // }
  let encData = btoa(JSON.stringify(data))

  let body = {
    "con": `{\"id\":\"\",\"mode\":\"GETFILTERLIST\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    "f": "onClickofMenuList (GETFILTERLIST)",
    // "dp": JSON.stringify(data),
    // "p": encData
    "p": JSON.stringify(data)
  }

  let finalfilterData

  await CommonAPI(body).then((res) => {
    if (res) {
      // console.log("res",res);
      sessionStorage.setItem("AllFilter", JSON.stringify(res?.Data?.rd));
      finalfilterData = res?.Data?.rd
    }
  })
  return finalfilterData
}