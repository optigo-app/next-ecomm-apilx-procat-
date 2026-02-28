import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const fetchPayMaster = async () => {
    let storeInit = getSession("storeInit");
    const storedData = getSession("loginUserDetail");
    const data = storedData;
    const customerId = data?.id ?? "";
    const customerEmail = data?.userid ?? "";

    try {
        const combinedValue = {
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
            Customerid: `${customerId ?? ""}`,
        };
        const encodedCombinedValue = btoa(combinedValue);
        
        const body = {
            con: `{\"id\":\"\",\"mode\":\"PAYMENTGATEWAYCOMBO\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "Paymentgatewaycombo",
            p: `{\"p1\":\"${encodedCombinedValue}\"}`,
        };
        const response = await CommonAPI(body);
        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
