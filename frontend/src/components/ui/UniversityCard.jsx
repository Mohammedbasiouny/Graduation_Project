import clsx from "clsx";

const UniversityCard = ({ title, image, alt, className, ...rest }) => {
  return (
    <div
      className={clsx(
        "w-full h-full p-6 flex flex-col items-center justify-between text-center rounded-xl border border-blue-200 bg-blue-50 duration-150 ease-in-out hover:shadow-lg hover:border-yellow-300 hover:bg-yellow-50",
        className
      )}
      {...rest}
    >
      {/* University Title */}
      <p className="text-gray-900 font-extrabold mb-4 text-lg sm:text-xl md:text-2xl">
        {title}
      </p>

      {/* University Image */}
      <div className="w-36 sm:w-44 md:w-48 h-36 sm:h-44 md:h-48 flex items-center justify-center">
        <img
          src={image}
          alt={alt || `${title} Logo`}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default UniversityCard;