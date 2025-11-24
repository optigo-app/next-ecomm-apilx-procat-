import axios from "axios";

const APIURL = `https://api.optigoapps.com/mobileapi/default.aspx`;

export const DeleteAccount = async () => {
  const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
  const users = JSON.parse(sessionStorage.getItem("loginUserDetail"));
  const Token = JSON.parse(sessionStorage.getItem("AuthToken")) ?? "";
  console.log(Token , "token")
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
    return {...response?.data , status: response?.status};
  } catch (error) {
    console.error("error is..", error);
  }
};
