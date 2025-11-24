import { CommonAPI } from "../CommonAPI/CommonAPI";

export const getQuotationQuoteData = async (data, CurrencyRate, FrontEnd_RegNo, customerid) => {
    try {
        const combinedValue = JSON.stringify({
            CurrencyRate: CurrencyRate, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${customerid}`
        });

        const encodedCombinedValue = btoa(combinedValue);
        const encodedCombinedValue2 = (combinedValue);

        const body = {
            "con": `{\"id\":\"Store\",\"mode\":\"getquote\",\"appuserid\":\"${data?.userid}\"}`,
            "f": "zen (cartcount)",
            // p: encodedCombinedValue,
            // dp:encodedCombinedValue2
            "p": encodedCombinedValue2
        };

        const response = await CommonAPI(body);
        return response

    } catch (error) {
        console.log(error);
    }
}