import React from 'react';

const Heading = () => {
  return (
    <div className="relative flex gap-3 justify-center items-center flex-wrap mb-4">
      <span className="relative text-[3rem] font-black text-black">
        Welcome To
      </span>
      <span className="relative text-[3rem] font-black" style={{ color: 'rgb(160, 40, 21)' }}>
        Hot Wheels
      </span>
    </div>
  );
};

export default Heading;
