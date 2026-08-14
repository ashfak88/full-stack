import React from 'react';

const SaleBadge = () => {
  return (
    <div className="absolute -top-6 -right-6 z-10 w-28 h-32 flex flex-col items-center rotate-6 hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer drop-shadow-2xl">
      {/* Ribbon tails */}
      <div className="absolute bottom-2 w-[70px] flex justify-between z-0">
        <div 
          className="w-7 h-14 bg-indigo-600" 
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)', 
            transform: 'rotate(25deg) translateX(-4px) translateY(-5px)' 
          }}>
        </div>
        <div 
          className="w-7 h-14 bg-indigo-600" 
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)', 
            transform: 'rotate(-25deg) translateX(4px) translateY(-5px)' 
          }}>
        </div>
      </div>
      
      {/* Starburst badge */}
      <div className="relative w-[95px] h-[95px] flex flex-col items-center justify-center z-10">
        {/* SVG Background - Replaces CSS clipPath so text doesn't get cut off! */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-purple-600 drop-shadow-lg" fill="currentColor">
          {/* Main starburst shape */}
          <polygon points="50,0 61,11 76,5 81,20 97,20 92,35 100,50 92,65 97,80 81,80 76,95 61,89 50,100 39,89 24,95 19,80 3,80 8,65 0,50 8,35 3,20 19,20 24,5 39,11" />
          {/* Dashed inner border */}
          <polygon points="50,0 61,11 76,5 81,20 97,20 92,35 100,50 92,65 97,80 81,80 76,95 61,89 50,100 39,89 24,95 19,80 3,80 8,65 0,50 8,35 3,20 19,20 24,5 39,11" 
                   stroke="#d8b4fe" strokeWidth="1.5" strokeDasharray="3,3" fill="none" transform="scale(0.92) translate(4.5, 4.5)"/>
        </svg>
        
        <div className="text-center transform -rotate-[4deg] mt-1 z-20 whitespace-nowrap relative">
          <div className="text-yellow-400 font-black text-[22px] leading-none drop-shadow-md" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.5)" }}>BIG</div>
          <div className="text-yellow-400 font-black text-[18px] leading-none drop-shadow-md" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.5)" }}>SALE</div>
          <div className="text-white text-[10px] font-bold mt-[2px] leading-tight tracking-wider">
            UP TO <span className="text-yellow-400 text-[14px]">50<span className="text-[10px]">%</span></span>
            <span className="text-[8px] ml-0.5 relative -top-1">OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleBadge;
