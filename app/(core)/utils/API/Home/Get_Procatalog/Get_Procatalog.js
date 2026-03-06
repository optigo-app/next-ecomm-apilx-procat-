import { getSession } from "../../../FetchSessionData";
import { CommonAPI } from "../../CommonAPI/CommonAPI";

export const Get_Procatalog = async (mode, customerID, ALCID) => {

    let response;
    const ALCID_Value = ALCID > 0 ? ALCID : "";
    try {
        const storeInit = getSession("storeInit") ?? "";
        let userLogin = getSession('LoginUser')
        const combinedValue = JSON.stringify({
            "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
            // "FrontEnd_RegNo": `${RegNo}`,
            "Customerid": `${customerID ?? ""}`,
            "ALC": `${ALCID_Value}`,
            "DomainForNo": `${storeInit?.DomainForNo ?? ''}`
        })
        const combinedValueLogin = JSON.stringify({

            "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
            // "FrontEnd_RegNo": `${RegNo}`,
            "Customerid": `${customerID ?? ""}`,
            "ALC": `${ALCID_Value}`,
            "DomainForNo": `${storeInit?.DomainForNo ?? ''}`
        })
        const email = getSession("registerEmail") ?? ""
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"${mode}\",\"appuserid\":\"${email}\"}`,
            "f": "zen (cartcount)",
            "p": userLogin ? combinedValueLogin : combinedValue,
        }
        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }

    return response;

}