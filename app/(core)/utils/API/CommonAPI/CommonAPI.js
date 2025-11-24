import { fetchAPIUrlFromStoreInit } from "../../Glob_Functions/GlobalFunction";
import axios from "axios";
let APIURL = '';

const setApiUrl = async () => {
    try {
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
export const CommonAPI = async (body) => {
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

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: !!YearCode ? YearCode : "e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIxfX17e3NvbmFzb25zfX17e3NvbmFzb25zfX0=",
            // Version: version,
            Version: "NXT",
            sp: "54",
            sv: !!sv ? sv : 1,
        };
        const response = await axios.post(APIURL, body, { headers: header, });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

