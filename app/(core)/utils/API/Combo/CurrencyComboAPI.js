



import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";


export const CurrencyComboAPI = async (finalID) => {
    let response;
    try {
        const storedEmail = getSession('registerEmail') || '';
        const storeInit = getSession('storeInit');
        const loginUserDetail = getSession('loginUserDetail') || '0';
        const { FrontEnd_RegNo } = storeInit;
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${finalID}`
        });

        const encodedCombinedValue = btoa(combinedValue);
        let body = {
            "con": `{\"id\":\"Store\",\"mode\":\"CURRENCYCOMBO\",\"appuserid\":\"${storedEmail}\"}`,
            "f": "on-index(home)-call (CURRENCYCOMBO)",
            "p": combinedValue, 
            // "p": encodedCombinedValue,
            // "dp": combinedValue,

        }
        
        response = await CommonAPI(body);

    } catch (error) {
        console.error('Error:', error);
    }
    return response;

}