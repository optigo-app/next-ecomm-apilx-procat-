'use client'
import React, { useState } from 'react'
import OldContimueWithMobile from './OldContinuewithMobile'
import NewContimueWithMobile from './ContimueWithMobile'

const MobileLogin = ({params , searchParams , storeInit}) => {
  const props = {params , searchParams , storeInit }
  const [isOtpNewUi , setIsOtpNewUi] = useState(true);
  return (
    <div>
        {isOtpNewUi ?  <NewContimueWithMobile {...props}/> : <OldContimueWithMobile {...props}/> }
        
    </div>
  )
}

export default MobileLogin