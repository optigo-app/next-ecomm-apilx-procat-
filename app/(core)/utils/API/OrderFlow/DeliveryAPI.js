import { CommonAPI } from '../CommonAPI/CommonAPI';

export const fetchAddresses = async () => {
    try {
        const storedData = JSON.parse(sessionStorage.getItem('loginUserDetail'));
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"GETSHIPINGADDRESS\",\"appuserid\":\"${storedData?.userid}\"}`,
            "f": "Delivery (FetchAddress)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        if (response.Data.rd) {
            return response.Data.rd;
        } else {
            // toast.error('Something went wrong');
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

export const addAddress = async (formData) => {
    try {
        const storedData = JSON.parse(sessionStorage.getItem('loginUserDetail'));
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            addrid: ``, firstname: `${formData.firstName}`, lastname: `${formData.lastName}`, street: `${formData.address}`, addressprofile: `${formData.firstName + formData.lastName}`, city: `${formData.city}`, state: `${formData.state}`, country: `${formData.country}`, zip: `${formData.zipCode}`, mobileno: `${formData.mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"ADDADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (AddAddress)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const editAddress = async (index, formData) => {
    try {
        const storedData = JSON.parse(sessionStorage.getItem('loginUserDetail'));
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        const { FrontEnd_RegNo } = storeInit;
        const addressData = JSON.parse(sessionStorage.getItem('addressData'));

        const combinedValue = JSON.stringify({
            addrid: `${index}`, firstname: `${formData.firstName}`, lastname: `${formData.lastName}`, street: `${formData.address}`, addressprofile: `${formData.firstName + formData.lastName}`, city: `${formData.city}`, state: `${formData.state}`, country: `${formData.country}`, zip: `${formData.zipCode}`, mobileno: `${formData.mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"EDITADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (EditAddress)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const deleteAddress = async (addressId) => {
    try {
        const storedData = JSON.parse(sessionStorage.getItem('loginUserDetail'));
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            addrid: `${addressId}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"DELADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (DeleteAddress)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue
            "p": combinedValue,

        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export const setDefaultAddress = async (address) => {
    try {
        const storedData = JSON.parse(sessionStorage.getItem('loginUserDetail'));
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        const { FrontEnd_RegNo } = storeInit;
        const addressId = address?.id;

        const combinedValue = JSON.stringify({
            addrid: `${addressId}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"SETDEFAULTADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (SetDefaultAddress)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue
            "p": combinedValue,

        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('Error:', error);
        return address;
    }
};
