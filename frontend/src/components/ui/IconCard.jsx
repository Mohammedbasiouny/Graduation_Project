const IconCard = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="group p-4 sm:p-5 w-full max-w-sm flex items-center gap-4 bg-(--blue-lightest) border border-(--blue-light) hover:bg-(--yellow-lightest) hover:border-(--yellow-light) rounded-xl shadow-sm duration-150 ease-in-out cursor-pointer">
      {Icon && <Icon className={"min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 text-(--blue-dark) group-hover:text-(--yellow-dark)"} />}
      <div className="flex flex-col">
        <p className="text-base sm:text-lg font-semibold text-gray-900">{title}</p>
        <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default IconCard