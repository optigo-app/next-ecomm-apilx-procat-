import { CommonAPI } from "../../CommonAPI/CommonAPI";
import { getSession } from "../../FetchSessionData";

export const GetHomeProductType = async (visiterId = "") => {
    try {
        const storeInit = getSession("storeInit");
        const loginUserDetail = getSession("loginUserDetail");
        const isLogin = getSession("LoginUser") ?? false;
        const userLogin = getSession('LoginUser');

        const dataSource = userLogin ? loginUserDetail : storeInit;

        const customerId = storeInit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null) ? visiterId : loginUserDetail?.id ?? 0;

        const customerEmail = storeInit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null) ? visiterId : loginUserDetail?.userid ?? "";

        const domain = window.location.hostname;
        const data = {
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
            Customerid: `${customerId ?? 0}`,
            PackageId: `${dataSource?.PackageId}`,
            domainname: domain
        };

        const encData = JSON.stringify(data);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"GetHomeProductType\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "PostMan",
            p: encData,
        };
        let response;
        await CommonAPI(body).then((res) => {
            if (res) response = res;
        });

        return response;
    } catch (error) {
        console.error("GetHomeProductType Error:", error);
        throw error;
    }
};
