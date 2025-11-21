
import React from 'react';

interface ControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  secondary?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ children, secondary = false, ...props }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-center";
  const primaryClasses = "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 shadow-lg";
  const secondaryClasses = "bg-white/10 border border-white/20 text-white hover:bg-white/20";

  return (
    <button className={`${baseClasses} ${secondary ? secondaryClasses : primaryClasses}`} {...props}>
      {children}
    </button>
  );
};

export default ControlButton;
