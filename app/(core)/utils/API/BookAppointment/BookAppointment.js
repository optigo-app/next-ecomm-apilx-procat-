import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const BookAppointment = async (obj = {}) => {
    const domainname = wesbiteDomainName;
    const data = {
        "firstname": obj?.firstname || "",
        "lastname": obj?.lastname || "",
        "EmailId": obj?.EmailId || "",
        "mobileno": obj?.mobileno || 0,
        "AppointmentMessage": obj?.AppointmentMessage || "",
        "AppointmentDateTime": obj?.AppointmentDateTime || "",
        "JewelleryType": obj?.JewelleryType || "",
        "RequestId": obj?.RequestId || 0,
        "domainname": domainname,
    }

    let stringify = JSON.stringify(data);

    let body = {
        "con": "{\"id\":\"\",\"mode\":\"BookAppointment\"}",
        "f": "BookAppointment",
        "p": stringify
    }

    let reVal;

    try {
        const res = await CommonAPI(body);
        reVal = res?.Data?.rd[0];
        return reVal;
    } catch (error) {
        console.log("BookAppointmentErr", error);
        return null
    }
}