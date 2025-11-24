import { CommonAPI } from "../CommonAPI/CommonAPI";

export const removeFromCartList = async (data, param, visiterId, isdiamond) => {
  try {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit")) || {};
    const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail")) || {};
    const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    const { FrontEnd_RegNo } = storeInit;
    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginUserDetail.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : loginUserDetail?.userid ?? "";
    let combinedValue;

    if (data == 'IsDeleteAll') {
      combinedValue = JSON.stringify({
        ForEvt: param,
        FrontEnd_RegNo: `${FrontEnd_RegNo}`,
        Customerid: `${customerId ?? 0}`,
        autocode: "",
        Cartidlist: "",
        isdelete_all: '1'
      });
    } else if (isdiamond == "isdiamond") {
      combinedValue = JSON.stringify({
        ForEvt: param,
        FrontEnd_RegNo: `${FrontEnd_RegNo}`,
        Customerid: `${customerId ?? 0}`,
        autocode: "",
        Cartidlist: "",
        isdelete_all: '',
        stockno: `${data?.stockno ?? ""}`
      });
    }
    else {
      combinedValue = JSON.stringify({
        ForEvt: param,
        FrontEnd_RegNo: `${FrontEnd_RegNo}`,
        Customerid: `${customerId ?? 0}`,
        autocode: `${data?.autocode ?? ""}`,
        Cartidlist: `${data?.id ?? ""}`,
        isdelete_all: "0"
      });
    }
    const encodedCombinedValue = btoa(combinedValue);
    const body = {
      con: `{\"id\":\"Store\",\"mode\":\"removeFromCartList\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
      f: "myWishLisy (handleRemoveCatList)",
      // p: encodedCombinedValue,
      // dp: combinedValue
      p: combinedValue,
    };

    const response = await CommonAPI(body);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
