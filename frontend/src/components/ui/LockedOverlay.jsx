import { Lock } from "lucide-react";

const LockedOverlay = ({ status = true, children, message = "", className = "" }) => {
  return (
    !status ? (
      children
    ) : (
      <div className={`w-full relative inline-block ${className}`}>
        {/* Children content blurred */}
        <div className="pointer-events-none filter blur-xs">{children}</div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-xs rounded-md">
          <Lock className="w-12 h-12 text-gray-700 mb-5" />
          <p className="text-gray-700 text-sm md:text-lg font-bold text-center">{message}</p>
        </div>
      </div>
    )
  );
};

export default LockedOverlay;
