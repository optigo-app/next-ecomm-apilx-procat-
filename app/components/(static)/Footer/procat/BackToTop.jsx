"use client";
import React from "react";

const BackToTop = () => {
  return (
    <>
      <div>
        <p
          style={{
            paddingBlock: "30px",
            margin: "0px",
            textAlign: "center",
            color: "black",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "1px",
          }}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          BACK TO TOP
        </p>
      </div>
    </>
  );
};

export default BackToTop;
