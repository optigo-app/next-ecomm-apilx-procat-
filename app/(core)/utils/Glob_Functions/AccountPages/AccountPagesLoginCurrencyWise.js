const currencyComboList = JSON.parse(sessionStorage.getItem("CurrencyCombo"));
export const AccountPagesLoginCurrencyWise = (apiData, loginInfo) => {
    
    // console.log(loginInfo?.CurrencyRate, loginInfo?.Currencysymbol, loginInfo?.CurrencyCode, loginInfo?.Currencyname);
    
    const defaultCurrency =  currencyComboList?.find((e) => e?.IsDefault === 1);


    const mainData = [];
    
    apiData?.forEach((e) => {

        let obj = {...e};

        if(obj?.CurrencyExchRate !== defaultCurrency?.CurrencyRate){
            obj.Amount = obj.Amount * obj?.CurrencyExchRate;
        }

        mainData.push(obj);
        
    });

    const mainData2 = [];

    mainData?.forEach((e) => {

        let obj = {...e};

        if (typeof obj?.Currency === 'number' && typeof loginInfo?.CurrencyRate === 'number' && loginInfo?.CurrencyRate !== 0) {
            obj.Amount = obj?.Amount / loginInfo?.CurrencyRate;
        }

        mainData2.push(obj);
    })

    

}