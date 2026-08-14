import React from 'react';

const ScrollingBanner = () => {
  const textItems = [
    "FREE SHIPPING",
    "PREMIUM CARS",
    "LIMITED EDITIONS",
    "24/7 SUPPORT",
    "FAST DELIVERY",
    "SECURE CHECKOUT",
    "HOT DEALS",
    "TOP QUALITY"
  ];

  // Join the items with a bullet point
  const joinedText = textItems.join(" • ") + " • ";

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {/* We render the text multiple times to ensure enough width for seamless scrolling */}
        <span className="marquee-text">{joinedText}</span>
        <span className="marquee-text">{joinedText}</span>
        <span className="marquee-text">{joinedText}</span>
        <span className="marquee-text">{joinedText}</span>
      </div>
    </div>
  );
};

export default ScrollingBanner;
