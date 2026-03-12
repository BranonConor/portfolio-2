"use client";

import React from "react";

const AdplistReviews: React.FC = () => {
  return (
    <div style={{ padding: "0 24px" }}>
      <section
        style={{
          height: "560px",
          borderRadius: "12px",
          overflow: "hidden",
          minWidth: "100%",
          maxWidth: "650px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
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
    </div>
  );
};

export default AdplistReviews;
