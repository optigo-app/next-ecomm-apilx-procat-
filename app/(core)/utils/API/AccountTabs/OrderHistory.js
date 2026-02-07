import { CommonAPI } from "../CommonAPI/CommonAPI";


const imageNotFound = "image-not-found.jpg";
export const getOrderHistory = async(storeinit, loginInfo, UserEmail) => {
    try {

        let EncodeData = {
            FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
            Customerid: `${loginInfo?.id}`,
          };
    
          const encodedCombinedValue = btoa(JSON.stringify(EncodeData));
    
          const body_currencycombo = {
            con: `{\"id\":\"Store\",\"mode\":\"CURRENCYCOMBO\",\"appuserid\":\"${UserEmail}\"}`,
            f: "m-test2.orail.co.in (getcategorysize)",
            p: `${encodedCombinedValue}`,
          };

        const response = await CommonAPI(body_currencycombo);

        const CurrencyRate = response?.Data?.rd[0]?.CurrencyRate;
  
        let EncodeData_order_history = {
          CurrencyRate: `${CurrencyRate}`,
          FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
          Customerid: `${loginInfo?.id}`,
        };
  
        // const encodedCombinedValue2 = btoa(
        //   JSON.stringify(EncodeData_order_history)
        // );

        const encodedCombinedValue2 = (
          JSON.stringify(EncodeData_order_history)
        );
  
        const body_order_history = {
          con: `{\"id\":\"Store\",\"mode\":\"GETORDERHISTORY\",\"appuserid\":\"${UserEmail}\"}`,
          f: "zen (cartcount)",
          // p: `${encodedCombinedValue2}`,
          p: `${encodedCombinedValue2}`,
        };
  
        const response2 = await CommonAPI(body_order_history);

        return response2;

    } catch (error) {
        console.log(error);
    }
}

export const getOrderItemDetails = async(obj, storeinit, loginInfo, UserEmail) => {

    try {

        let EncodeData = {
            FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
            Customerid: `${loginInfo?.id}`,
          };
          
          // const encodedCombinedValue = btoa(JSON.stringify(EncodeData));
          const encodedCombinedValue = (JSON.stringify(EncodeData));
    
          const body_currencycombo = {
            con: `{\"id\":\"Store\",\"mode\":\"CURRENCYCOMBO\",\"appuserid\":\"${UserEmail}\"}`,
            f: "m-test2.orail.co.in (getcategorysize)",
            p: `${encodedCombinedValue}`,
          };
    
          const response = await CommonAPI(body_currencycombo);
    
          const CurrencyRate = response?.Data?.rd[0]?.CurrencyRate;
          let EncodeData_order_history = {
            orderno: `${obj?.orderno}`,
            isStockPrint: "1",
            CurrencyRate: `${CurrencyRate}`,
            FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
            Customerid: `${loginInfo?.id}`,
          };
    
          // const encodedCombinedValue2 = btoa(
          //   JSON.stringify(EncodeData_order_history)
          // );
          const encodedCombinedValue2 = ( JSON.stringify(EncodeData_order_history));
    
    
          const body_order_detail = {
            con: `{\"id\":\"Store\",\"mode\":\"GETORDERHISTORYDETAIL\",\"appuserid\":\"${UserEmail}\"}`,
            f: "zen (cartcount)",
            p: `${encodedCombinedValue2}`,
            // dp: `${encodedCombinedValue2}`,
          };
    
          const response2 = await CommonAPI(body_order_detail);

          return response2;
        
    } catch (error) {
        console.log(error);
    }

}

export const handleOrderImageError = (e) => {
    e.target.src = imageNotFound;
}