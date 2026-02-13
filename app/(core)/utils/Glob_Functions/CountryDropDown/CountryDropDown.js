import './CountryDropDown.scss';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const CountryDropDown = ({
  emailRef,
  setMobileNo,
  mobileNo,
  mobileNoRef,
  IsMobileThrough,
  handleKeyDown,
  handleInputChange,
  Errors,
  setErrors,
  Countrycodestate,
  setCountrycodestate,
  setCountryShortName,

}) => {
  const [CountryDefault, setCountryDefault] = useState();
  const [Countrycode, setCountrycode] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {

    const FetchCodeList = async () => {
      try {
        const response = JSON.parse(sessionStorage.getItem('CountryCodeListApi')) ?? [];
        console.log("🚀 ~ FetchCodeList ~ response:", response)
        setCountrycode(response);

        const defaultCountry = response?.find((val) => val?.IsDefault == 1) || response[0];
        const mob = sessionStorage.getItem('Countrycodestate');

        if (mob) {
          if (typeof setCountrycodestate === 'function') {
            setCountrycodestate(mob);
          }
          const currentCountry = response?.find((val) => (val?.mobileprefix == mob || val?.MobilePrefix == mob));
          if (currentCountry) {
            setCountryDefault(currentCountry?.PhoneLength || currentCountry?.phonelength || 10);
            if (typeof setCountryShortName === 'function') {
              setCountryShortName(currentCountry?.CountryShortName || currentCountry?.countryshortname || "IND");
            }
          } else {
            setCountryDefault(defaultCountry?.PhoneLength || defaultCountry?.phonelength || 10);
          }
        } else {
          if (typeof setCountrycodestate === 'function') {
            setCountrycodestate(defaultCountry?.mobileprefix);
          }
          if (typeof setCountryShortName === 'function') {
            setCountryShortName(defaultCountry?.CountryShortName || defaultCountry?.countryshortname || "IND");
          }
          setCountryDefault(defaultCountry?.PhoneLength || defaultCountry?.phonelength || 10);
        }
      } catch (error) {
        console.log(error)
      }
    }
    FetchCodeList()
  }, [setCountrycodestate, setCountryShortName]);

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
    if (value) {
      setCountrycodestate(value?.mobileprefix);
      if (typeof setCountryShortName === 'function') {
        setCountryShortName(value?.CountryShortName || value?.countryshortname || "IND");
      }
      setCountryDefault(value?.PhoneLength || value?.phonelength || 10);
      setOpen(false);
      setMobileNo('')
      setErrors((prev) => ({
        ...prev,
        mobileNo: ``,
      }));
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

    if (numericValue.length === CountryDefault) {
      setErrors((prev) => ({
        ...prev,
        mobileNo: '',
      }));
    } else if (numericValue?.length > 0 && numericValue?.length < CountryDefault) {
      setErrors((prev) => ({
        ...prev,
        mobileNo: `Mobile number must be ${CountryDefault} digits.`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mobileNo: '',
      }));
    }
    handleInputChange(e, setMobileNo, 'mobileNo');
  };

  return (
    <div className="mobile-smr" ref={dropdownRef}
      style={{
        gap: '0px'
      }}
    >
      <div className="MOBILE_CODE"
        onClick={() => !IsMobileThrough && setOpen(true)}
      >
        <input
          type="text"
          placeholder="91"
          value={Countrycodestate}
          onFocus={() => !IsMobileThrough && setOpen(true)}
          readOnly={IsMobileThrough}
          style={{
            cursor: 'pointer',
            pointerEvents: 'none',
          }}
        />
      </div>
      {!IsMobileThrough && open && (
        <div className="county_Dropdown_list">
          <Autocomplete
            disablePortal
            options={Countrycode}
            getOptionLabel={(option) => `${option?.mobileprefix} - ${option?.countryname}`}
            sx={{ width: '100%' }}
            open={open}
            freeSolo
            inputRef={mobileNoRef}
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
        type="text"
        inputMode="numeric"
        inputProps={{
          maxLength: CountryDefault,
          pattern: '[0-9]*',
        }}
        sx={{
          margin: '8px -1px 23px 27px'
        }}
        value={mobileNo}
        inputRef={mobileNoRef}
        onKeyDown={(e) => handleKeyDown(e, emailRef)}
        onChange={handleMobileInputChange}
        error={!!Errors.mobileNo}
        helperText={Errors.mobileNo}
      />
    </div>
  );
};

export default CountryDropDown;
