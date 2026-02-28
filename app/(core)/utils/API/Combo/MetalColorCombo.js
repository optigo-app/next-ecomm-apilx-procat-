import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const MetalColorCombo = async (visiterId) => {
    let response;

    const storeInit = getSession('storeInit');
    const FrontEnd_RegNo = storeInit?.FrontEnd_RegNo;
    const storedEmail = getSession('registerEmail') || '';
    const loginInfo = getSession("loginUserDetail") || {};
    const islogin = getSession("LoginUser") ?? false;

    const isB2B = storeInit?.IsB2BWebsite === 0;
    const isGuest = !islogin;

    const customerId = isB2B && isGuest ? (visiterId ?? '') : (loginInfo.id ?? 0);
    const customerEmail = isB2B && isGuest ? (visiterId ?? '') : (loginInfo?.userid ?? "");

    try {
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: FrontEnd_RegNo ?? '',
            Customerid: customerId ?? 0
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{"id":"","mode":"METALCOLORCOMBO","appuserid":"${customerEmail}"}`,
            f: "index (getSizeData)",
            p: combinedValue,
            // p: encodedCombinedValue,
            // dp: combinedValue,

        };

        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }

    return response;
};
