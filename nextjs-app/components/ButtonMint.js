import React from "react";

const ButtonMint = (props) => {
  async function mint(ev) {
    ev.preventDefault();
    props.mint();
  }

  return (
    <button
      type="button"
      className="m-4 inline-flex w-48 p-2 overflow-hidden text-xs font-bold leading-normal text-gray-900 uppercase bg-green-300 rounded-md whitespace-nowrap font-inter hover:bg-green-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
      onClick={(ev) => mint(ev)}
    >
      <div className="mx-auto">
        <span className="sr-only">mint nft</span>
        {props.buttonName}
      </div>
    </button>
  );
};

export default ButtonMint;
