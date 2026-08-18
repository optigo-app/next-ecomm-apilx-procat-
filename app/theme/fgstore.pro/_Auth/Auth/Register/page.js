import React from 'react';
import B2CRegister from './B2CRegister';
import B2BRegister from './B2bRegister';
import B2BLRegister from './B2C.base';

const Page = ({ searchParams, storeInit }) => {
  const isB2B = storeInit?.IsSignUpWithCompanyInfo === 1;

  return isB2B ? (
    <>
      <B2BRegister searchParams={searchParams} />
    </>
  ) : (
    <>
      <B2CRegister searchParams={searchParams} />
    </>
  );
};

export default Page;