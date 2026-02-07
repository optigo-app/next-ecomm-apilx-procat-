import axios from "axios";

function getApiUrl() {
  // only safe in browser
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    const localHosts = [
      "localhost",
      "zen",
      "fgstore.web",
      "fgstore.mapp",
      "fgstorepro.mapp",
      "fgstore.pro",
      "fgstore.plw",
      "malakan.web",
      "rpjewel.web",
      "hdstore.web",
      "hdstore.mapp",
      "hdstore.pro",
      "hdstore.plw",
      "stamford.web",
      "mddesignworld.web",
      "elvee.web",
      "diamondtine.web",
      "forevery.web",
      "hoq.web",
    ];

    if (localHosts.includes(host)) {
      return "http://zen/api/razorpay.aspx";
    }
    return "https://api.optigoapps.com/ReactStore/razorpay.aspx";
  }

  // server-side default (you can tune this)
  return "https://api.optigoapps.com/ReactStore/razorpay.aspx";
}

export async function CommonAPIForRazorPay(body) {
  // safe sessionStorage
  let storeInit = null;
  if (typeof window !== "undefined") {
    try {
      storeInit = JSON.parse(sessionStorage.getItem("storeInit") || "{}");
    } catch {
      storeInit = {};
    }
  }

  try {
    const YearCode = storeInit?.YearCode ?? "";
    const version = storeInit?.version ?? "";
    const token = storeInit?.token ?? "";
    const sv = storeInit?.sv ?? "";

    const headers = {
      Authorization: `Bearer ${token}`,
      Yearcode: YearCode,
      sv: 0,
    };

    const response = await axios.post(getApiUrl(), body, { headers });
    return response?.data;
  } catch (error) {
    console.error("CommonAPIForRazorPay error:", error);
    throw error;
  }
}


// import axios from "axios";
// // const APIURL = 'https://api.optigoapps.com/storev26/store.aspx';
// // const APIURL = 'http://zen/api/ReactStore.aspx'
// // const APIURL = (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/storev26/ReactStore.aspx';
// const APIURL = (window.location.hostname === 'localhost'
//     || window.location.hostname === 'zen'
//     || window.location.hostname === 'fgstore.web'
//     || window.location.hostname === 'fgstore.mapp'
//     || window.location.hostname === 'fgstorepro.mapp'
//     || window.location.hostname === 'fgstore.pro'
//     || window.location.hostname === 'fgstore.plw'
//     || window.location.hostname === 'malakan.web'
//     || window.location.hostname === 'rpjewel.web'
    
//     || window.location.hostname === 'hdstore.web'
//     || window.location.hostname === 'hdstore.mapp'
//     || window.location.hostname === 'hdstore.pro'
//     || window.location.hostname === 'hdstore.plw'
//     || window.location.hostname === 'stamford.web'
//     || window.location.hostname === 'mddesignworld.web'

//     || window.location.hostname === 'elvee.web'
//     || window.location.hostname === 'diamondtine.web'
//     || window.location.hostname === 'forevery.web'
//     || window.location.hostname === 'hoq.web') ? 'http://zen/api/razorpay.aspx' : 'https://api.optigoapps.com/ReactStore/razorpay.aspx';
//     // || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/test/ReactStore.aspx';

// // const APIURL = 'https://api.optigoapps.com/test/store.aspx';
// // const NEWAPIURL = 'https://api.optigoapps.com/storev26/ReactStore.aspx';
// // const ZENURL = 'http://zen/api/store.aspx'


// export const CommonAPIForRazorPay = async (body) => {
//     const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
//     try {
//         const YearCode = storeInit?.YearCode ?? '' ;
//         const version = storeInit?.version  ?? '';
//         const token = storeInit?.token ?? '';
//         const sv = storeInit?.sv ?? '';

//         const header = {
//             Authorization: `Bearer ${token}`,
//             Yearcode: YearCode,
//             // Version: version,
//             // sp: "1",
//             sv: 0
//         };
//         const response = await axios.post(APIURL, body, { headers: header });
//         return response?.data;

//     } catch (error) {
//         console.error('error is..', error);
//     }
// };

