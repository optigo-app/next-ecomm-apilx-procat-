// import React, { useState, useEffect } from 'react';

import React from "react";


// export const Timer = React.memo(({ onComplete }) => {
//   const [seconds, setSeconds] = useState(120);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setSeconds((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           onComplete();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [onComplete]);

//   return (
//     <span className="timer">
//       {seconds < 10 ? `0${seconds}` : seconds}s
//     </span>
//   );
// });


export const Timer = React.memo(({ seconds, onComplete }) => {
  return (
    <span className="timer">
      {seconds < 10 ? `0${seconds}` : seconds}s
    </span>
  );
});
