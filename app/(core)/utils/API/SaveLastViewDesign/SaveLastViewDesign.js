import { CommonAPI } from '../CommonAPI/CommonAPI'

export const SaveLastViewDesign = async (visiterId, autocode, designno) => {

  let storeInit = JSON.parse(sessionStorage.getItem("storeInit"))
  let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"))
  let userEmail = sessionStorage.getItem("registerEmail")
  const islogin = JSON.parse(sessionStorage.getItem("LoginUser")) ?? false;

  const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginInfo.id ?? 0;
  const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginInfo?.userid ?? 0;

  let data = {
    "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo ?? 0}`,
    "autocode": `${autocode ?? 0}`,
    "designno": `${designno ?? 0}`,
    "Customerid": `${customerId ?? 0}`,
  }

  let stringify = JSON.stringify(data);

  let body = {
    "con": `{\"id\":\"\",\"mode\":\"SaveLastViewDesign\",\"appuserid\":\"${customerEmail ?? ""}\"}`
    , "f": "SaveLastViewDesign"
    , "p": stringify
  }

  let ReVal;

  try {
    const res = await CommonAPI(body);
    ReVal = res?.Data?.rd[0];
    return ReVal;
  } catch (error) {
    console.log("SaveLastViewDesignErr", error);
    return null
  }
}

