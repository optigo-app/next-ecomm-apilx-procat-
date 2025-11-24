import { CommonAPI } from "../../CommonAPI/CommonAPI";

export const Get_Procatalog = async (mode, customerID, ALCID) => {

    let response;
    try {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit")) ?? ""
        let userLogin = sessionStorage.getItem('LoginUser')
        const combinedValue = JSON.stringify({
            "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
            // "FrontEnd_RegNo": `${RegNo}`,
            "Customerid": `${customerID ?? ""}`,
            "ALC": `${ALCID ?? ""}`,
            "DomainForNo": `${storeInit?.DomainForNo ?? ''}`
        })
        const combinedValueLogin = JSON.stringify({

            "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
            // "FrontEnd_RegNo": `${RegNo}`,
            "Customerid": `${customerID ?? ""}`,
            "ALC": `${ALCID ?? ""}`,
            "DomainForNo": `${storeInit?.DomainForNo ?? ''}`
        })
        const email = sessionStorage.getItem("registerEmail") ?? ""
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