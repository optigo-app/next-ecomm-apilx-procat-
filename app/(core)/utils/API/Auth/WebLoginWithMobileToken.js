import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const WebLoginWithMobileToken = async (ismobiletoke) => {

    let response
    const domainname = wesbiteDomainName;
    try {
        const combinedValue = JSON.stringify({
            userid: '', mobileno: '', pass: '', mobiletoken: `${ismobiletoke}`, FrontEnd_RegNo: '', domainname: domainname
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": "{\"id\":\"\",\"mode\":\"WEBLOGINMOBILETOKEN\"}",
            "f": "WEBLOGINMOBILETOKEN (handleSubmit)",
            // p: encodedCombinedValue,
            // dp: combinedValue
            "p": combinedValue
        };
        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;

}