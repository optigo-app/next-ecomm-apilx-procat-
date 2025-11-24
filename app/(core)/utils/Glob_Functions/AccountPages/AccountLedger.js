export const loginUserDetailWiseAccountLedgerData = (apiData, homeCurrency, loginInfo) => {

    const currencyComboList = JSON.parse(sessionStorage.getItem('CurrencyCombo'));

    const obj = currencyComboList?.find((e) => e?.IsDefault === 1);

    let currencyObj = {
    currencyCode:obj?.Currencycode,
    currencyRate:obj?.CurrencyRate,
    currencySymbol:obj?.Currencysymbol,
    Currencyname:obj?.Currencyname
    }
    
    // setHomeCurrency(currencyObj);

    const mainData2 = [];
    const mainData3 = [];

    apiData?.forEach((e) => {
        let obj = { ...e };

        if(obj?.CurrRate !== currencyObj?.currencyRate){
            obj.Currency = obj?.Currency * obj?.CurrRate;
        }
        
        // if (obj?.CurrRate !== loginInfo?.CurrencyRate) {
        //     // Validate that both obj.Currency and loginInfo.CurrRate are valid numbers
        //     if (typeof obj?.Currency === 'number' && typeof loginInfo?.CurrencyRate === 'number' && loginInfo?.CurrencyRate !== 0) {
        //         obj.Currency = obj?.Currency / loginInfo?.CurrencyRate;
        //     }
        // }
        mainData2.push(obj);
    });

    mainData2?.forEach((e) => {
        let obj = {...e};

                if (typeof obj?.Currency === 'number' && typeof loginInfo?.CurrencyRate === 'number' && loginInfo?.CurrencyRate !== 0) {
                    obj.Currency = obj?.Currency / loginInfo?.CurrencyRate;
                }
        mainData3.push(obj);
    })


    return mainData3;
    

}