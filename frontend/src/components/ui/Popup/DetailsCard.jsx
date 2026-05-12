const DetailsCard = ({ 
  icon, 
  title, 
  subtitle, 
  children, 
}) => {
  return (
    <div className={`bg-gray-100 rounded-lg p-3 md:p-5 space-y-3`}>
      {icon && (
        <div className="flex flex-col items-center gap-3">
          <div className="bg-gray-200 p-5 rounded-full">
            {icon}
          </div>
          {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
          {subtitle && <h2 className="text-lg font-semibold text-gray-800">{subtitle}</h2>}
        </div>
      )}
      {children}
    </div>
  );
};

export default DetailsCard;
