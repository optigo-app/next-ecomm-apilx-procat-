'use client'

import './CountryDropDown.scss';
import { Alert, Autocomplete, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CountryCodeListApi } from '../../API/Auth/CountryCodeListApi';
import Cookies from 'js-cookie';
import Link from 'next/link';

const CountryDropDown = ({
  setMobileNo,
  mobileNo,
  handleInputChange,
  Errors,
  setErrors,
  Countrycodestate,
  setCountrycodestate,
  onSubmit
}) => {
  const visiterID = Cookies.get('visiterId');
  const [CountryDefault, setCountryDefault] = useState();
  const [Countrycode, setCountrycode] = useState([]);
  const [open, setOpen] = useState(false);
  const [isIndiaSelected, setIsIndiaSelected] = useState(true);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const storeInit = JSON?.parse(sessionStorage.getItem('storeInit'));
    const loginUserDetail = JSON?.parse(sessionStorage.getItem('loginUserDetail'));
    const LoginUser = JSON?.parse(sessionStorage.getItem('LoginUser'));
    const finalID =
      storeInit?.IsB2BWebsite === 0
        ? LoginUser === false
          ? visiterID
          : loginUserDetail?.id || '0'
        : loginUserDetail?.id || '0';
    CountryCodeListApi(finalID)
      .then((res) => {
        const phonecode = res?.Data?.rd?.filter((val) => (val?.IsDefault == 1 || val?.isdefault == 1));
        const defaultPrefix = phonecode[0]?.mobileprefix;
        const defaultLength = phonecode[0]?.PhoneLength || phonecode[0]?.phonelength || 10;
        setCountrycodestate(defaultPrefix);
        setCountryDefault(defaultLength);
        setIsIndiaSelected(defaultPrefix === '91');
        setCountrycode(res?.Data?.rd);
        sessionStorage.setItem('CountryCodeListApi', JSON.stringify(res?.Data?.rd));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);



  const handleCountryChange = (event, value) => {
    setErrors({ ...Errors, mobileNo: ` ` });
    if (value) {
      setCountrycodestate(value?.mobileprefix);
      setCountryDefault(value?.PhoneLength);

      if (value?.mobileprefix === '91') {
        setIsIndiaSelected(true);  // Set to true if India is selected
      } else {
        setIsIndiaSelected(false); // Set to false for other countries
      }

      setOpen(false);
      setMobileNo('')
    }
  };

  const handleMobileInputChange = (e) => {
    const value = e.target.value;

    if (value.length > CountryDefault) {
      e.preventDefault();
      return;
    }

    const numericValue = value.replace(/[^0-9]/g, '');
    e.target.value = numericValue;

    const phonecode = Countrycode?.find((val) => (val?.mobileprefix == Countrycodestate || val?.MobilePrefix == Countrycodestate));
    const requiredLength = phonecode?.PhoneLength || phonecode?.phonelength || 10;
    const isValid = new RegExp(`^\\d{${requiredLength}}$`).test(numericValue.trim());

    if (!isValid) {
      setErrors({
        ...Errors,
        mobileNo: requiredLength ? `Mobile number must be ${requiredLength} digits.` : "Enter a valid mobile number.",
      });
    } else {
      setErrors({
        ...Errors,
        mobileNo: '',
      });
    }

    handleInputChange(e, setMobileNo, 'mobileNo');
  };

  const handleKeyChange = (e) => {
    const Enter = e.key === 'Enter';
    if (Enter) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <>
      <div className="mobile-smr" ref={dropdownRef}>
        <div className="MOBILE_CODE"
          onClick={() => setOpen(true)}
        >
          <input
            type="text"
            placeholder="91"
            value={Countrycodestate}
            onFocus={() => setOpen(true)}
            readOnly
            style={{
              cursor: 'pointer',
              pointerEvents: 'none',
            }}
          />
        </div>
        {open && (
          <div className="county_Dropdown_list">
            <Autocomplete
              disablePortal
              options={Countrycode}
              getOptionLabel={(option) => `${option?.mobileprefix} - ${option?.countryname}`}
              sx={{ width: '100%' }}
              open={open}
              onChange={handleCountryChange}
              renderInput={(params) => <TextField {...params} placeholder="Search Your Country" />}
            />
          </div>
        )}

        <TextField
          name="user-mobileNo"
          id="outlined-basic mobileNo"
          label="Mobile No."
          variant="outlined"
          autoComplete="new-mobileNo"
          className="labgrowRegister"
          style={{ margin: '15px' }}
          type="text"
          inputMode="numeric" // Ensures mobile number input on mobile devices
          inputProps={{
            maxLength: CountryDefault, // Dynamically set maxLength based on country
            pattern: '[0-9]*', // Ensure only numbers can be typed
          }}
          value={mobileNo}
          onChange={handleMobileInputChange} // Using local handler to check length
          error={!!Errors?.mobileNo} // Show error if it exists
          helperText={Errors?.mobileNo}
          onKeyDown={handleKeyChange}
          autoFocus={true}
        />
      </div>
      {!isIndiaSelected && (
        <div className="mobile-smr">
          <Alert sx={{
            fontSize: '12px',
          }} severity="warning" className="labgrowRegister">
            OTP verification is restricted to Indian mobile numbers (+91) only.
            <Link href={'/ContinueWithEmail'} style={{ marginLeft: '5px' }}>Login with Email.</Link>
          </Alert>
        </div>
      )}

      <div className='mobile-smr'>
        <span className='m-txt-msg'>&#9741; Verify via <div style={{ color: 'green' }}>WhatsApp</div> only! Check your messages for OTP.</span>
      </div>

    </>

  );
};

export default CountryDropDown;
