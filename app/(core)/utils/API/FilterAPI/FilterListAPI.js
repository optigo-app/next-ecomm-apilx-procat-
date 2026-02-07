import { CommonAPI } from "../CommonAPI/CommonAPI"


export const FilterListAPI = async (mainData, visiterId) => {

  let storeinit = JSON.parse(sessionStorage.getItem("storeInit"))
  let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"))
  let menuparams = JSON.parse(sessionStorage.getItem("menuparams"))
  let userEmail = sessionStorage.getItem("registerEmail")

  const islogin = JSON.parse(sessionStorage.getItem("LoginUser")) ?? false;

  const customerId = storeinit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginInfo?.id ?? 0;
  const customerEmail = storeinit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginInfo?.userid ?? "";

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

      if (prefix === "S") {
        try {
          serachVar = JSON.parse(atob(value));
        } catch (e) {
          console.error("Error decoding searchVar:", e);
        }
      } else if (prefix === "A") {
        try {
          const decodedValue = atob(value);
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
          const decoded = atob(mainData);
          if (decoded?.split("=")[0] === "AlbumName") {
            MenuParams.FilterKey = decoded.split("=")[0];
            MenuParams.FilterVal = decoded.split("=")[1];
          } else {
            MenuParams.FilterKey = decoded;
            MenuParams.FilterVal = decoded;
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
    "PackageId": `${loginInfo?.PackageId ?? storeinit?.PackageId}`,
    "autocode": "",
    "FrontEnd_RegNo": `${storeinit?.FrontEnd_RegNo}`,
    "Customerid": `${customerId ?? 0}`,
    "FilterKey": `${MenuParams?.FilterKey ?? ""}`,
    "FilterVal": `${MenuParams?.FilterVal ?? ""}`,
    "FilterKey1": `${MenuParams?.FilterKey1 ?? ""}`,
    "FilterVal1": `${MenuParams?.FilterVal1 ?? ""}`,
    "FilterKey2": `${MenuParams?.FilterKey2 ?? ""}`,
    "FilterVal2": `${MenuParams?.FilterVal2 ?? ""}`,
    SearchKey: `${serachVar?.b ?? ""}`,
    CurrencyRate: `${loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate}`,
    DomainForNo: `${storeinit?.DomainForNo ?? ""}`
  }
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