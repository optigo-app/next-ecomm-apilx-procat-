
import axios from "axios";
import { fetchAPIUrlFromStoreInit } from "../../Glob_Functions/GlobalFunction";
// const APIURL = 'https://api.optigoapps.com/storev26/store.aspx';
// const APIURL = 'http://zen/api/ReactStore.aspx'
// const APIURL = (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/storev26/ReactStore.aspx';

let APIURL = '';

const setApiUrl = async () => {
    try {
        // const getApi = await fetchAPIUrlFromStoreInit();
        // const getApi = { ApiUrl: "https://api.optigoapps.com/ReactStoreV3/ReactStore.aspx" };
        const getApi = { ApiUrl: "https://apilx.optigoapps.com/api/report" };
        if (getApi?.ApiUrl) {
            APIURL = getApi.ApiUrl;
        } else {
            throw new Error("API URL not found");
        }
    } catch (error) {
        console.error('Failed to fetch API URL:', error);
    }
};

setApiUrl();
// const isTesting = false;
// const LIVE_BASE_URL = isTesting ? `https://api.optigoapps.com/ReactStoreTest/ReactStore.aspx` : 'https://api.optigoapps.com/ReactStore/ReactStore.aspx';
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
//     || window.location.hostname === 'lovein.web'
//     || window.location.hostname === 'ornaz.web'

//     || window.location.hostname === 'elvee.web'
//     || window.location.hostname === 'diamondtine.web'
//     || window.location.hostname === 'forevery.web'
//     || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : LIVE_BASE_URL;
// || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/test/ReactStore.aspx';

// const APIURL = 'https://api.optigoapps.com/test/store.aspx';
// const NEWAPIURL = 'https://api.optigoapps.com/storev26/ReactStore.aspx';
// const ZENURL = 'http://zen/api/store.aspx'


export const CommonFileAPI = async (body, isUpload = false) => {
    if (!APIURL) {
        await setApiUrl();
    }

    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));

    if (!storeInit) {
        throw new Error('StoreInit data not found in sessionStorage');
    }
    try {
        const YearCode = storeInit?.YearCode ?? '';
        const version = storeInit?.version ?? '';
        const token = storeInit?.token ?? '';
        const sv = storeInit?.sv ?? '';

      

        let finalURL = APIURL;
        let ContentType = "application/json";
        if (isUpload && APIURL?.includes("report")) {
            finalURL = APIURL.replace("report", "upload");
            ContentType = "multipart/form-data";
        }
          const header = {
            "Content-Type": ContentType,
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            Version: "NXT",
            sp: "54",
            sv: sv
        };

        const response = await axios.post(finalURL, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

