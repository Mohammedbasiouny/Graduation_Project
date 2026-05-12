import React from "react";

const BackDrop = ({ open, onClose }) => {
  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 bg-black/50 backdrop-blur-sm
        transition-opacity duration-300 ease-in-out
        z-9997
        ${open 
          ? "opacity-100 pointer-events-auto" 
          : "opacity-0 pointer-events-none"
        }
      `}
    />
  );
};

export default BackDrop;