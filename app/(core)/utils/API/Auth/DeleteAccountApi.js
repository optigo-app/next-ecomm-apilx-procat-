import axios from "axios";
import { getSession } from "../../FetchSessionData";

const APIURL = `https://api.optigoapps.com/mobileapi/default.aspx`;

export const DeleteAccount = async () => {
  const storeInit = getSession("storeInit");
  const users = getSession("loginUserDetail");
  const Token = getSession("AuthToken") ?? "";

  const userid = users?.userid ?? "";
  try {
    const body = {
      "mode": "DELACCOUNT",
      "userid": userid
    }
    const response = await axios.post(APIURL, body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token?.split(` `)[1]}`,
        "domain": `https://apptstore.orail.co.in` || window.location.hostname,
      },
    });
    return { ...response?.data, status: response?.status };
  } catch (error) {
    console.error("error is..", error);
  }
};
