'use client'
import React, { useState } from 'react'
import OldContimueWithEmail from './OldContinuewithEmail'
import NewContimueWithEmail from './ContinueWithEmail'

const EmailLogin = ({params , searchParams , storeInit}) => {
  const [isOtpNewUi , setIsOtpNewUi] = useState(true);

  return (
    <div>
        {isOtpNewUi ?  <NewContimueWithEmail params={params} searchParams={searchParams} storeInit={storeInit}/> : <OldContimueWithEmail params={params} searchParams={searchParams} storeInit={storeInit}/> }
        
    </div>
  )
}

export default EmailLogin