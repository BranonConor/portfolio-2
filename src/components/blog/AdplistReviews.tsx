"use client";

import React from "react";

const AdplistReviews: React.FC = () => {
  return (
    <section
      style={{
        height: "560px",
        boxShadow: "rgba(142, 151, 158, 0.15) 0px 4px 19px 0px",
        borderRadius: "16px",
        overflow: "hidden",
        minWidth: "100%",
        maxWidth: "650px",
      }}
    >
      <iframe
        src="https://adplist.org/widgets/reviews?src=branon-eusebio"
        title="All Reviews"
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: "0px" }}
      ></iframe>
    </section>
  );
};

export default AdplistReviews;
