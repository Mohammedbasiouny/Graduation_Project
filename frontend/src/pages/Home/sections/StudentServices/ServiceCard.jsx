export const ServiceCard = ({ icon: Icon, title, maxWidth = 450, subtitle }) => {
  return (
    <div
      className={`
        group w-90 md:w-[${maxWidth}px] h-full min-h-45
        p-5
        flex flex-col items-center gap-4
        bg-gray-50 border border-gray-100
        hover:bg-yellow-50 hover:border-yellow-200
        rounded-xl shadow-sm
        transition-all duration-150 ease-in-out
        cursor-pointer
      `}
    >
      {/* Icon */}
      <div
        className="
          min-w-10 min-h-10 sm:min-w-12 sm:min-h-12
          flex items-center justify-center
          bg-(--navy-deep) group-hover:bg-(--gold-main)
          rounded-full
          text-white
          transition-colors duration-150
        "
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-base sm:text-lg font-semibold text-gray-900">
          {title}
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
