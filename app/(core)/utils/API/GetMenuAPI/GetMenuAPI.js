import { CommonAPI } from "../CommonAPI/CommonAPI";

export const GetMenuAPI = async (finalID) => {
    let response;
    try {
        const storeInit = JSON.parse(sessionStorage.getItem("storeInit")) ?? ""
        const email = sessionStorage.getItem("registerEmail") ?? ""
        const body = {
            // con: "{\"id\":\"\",\"mode\":\"GETMENU\",\"appuserid\":\"nimesh@ymail.in\"}",
            con: `{\"id\":\"\",\"mode\":\"GETMENU\",\"appuserid\":\"${email}\"}`,
            f: "onload (GETMENU)",
            // p: pEnc
            p:`{\"FrontEnd_RegNo\":\"${storeInit?.FrontEnd_RegNo}\",\"Customerid\":\"${finalID}\"}`
        }

        response = await CommonAPI(body);
    } catch (error) {
        console.error('Error:', error);
    }

    return response;

}