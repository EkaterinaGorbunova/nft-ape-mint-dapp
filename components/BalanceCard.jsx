import React from "react";

const BalanceCard = (props) => {
  return (
    <>
      <div className="flex flex-row justify-center text-md leading-normal mx-0 mt-4 rounded-lg md:mt-0 space-x-0 sm:space-x-4">
        <div className="group flex items-center text-gray-300 jus">
          <span className="pl-0">ETH:</span>
          <div className="pl-1 font-bold text-white uppercase font-inter">
            {props.ethBalance}
          </div>
          <span className="pl-4">NFTs:</span>
          <div className="pl-1 mt-auto font-bold text-white uppercase font-inter">
            {props.itemBalance}
          </div>
        </div>
      </div>
    </>
  );
};

export default BalanceCard;
