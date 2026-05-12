export const InfoCard = ({ icon, title, description, variant = "primary" }) => {
  const variants = {
    primary:
      "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    dark:
      "bg-(--navy-deep) text-white border border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5",
  };

  return (
    <div
      className={`rounded-3xl p-7 sm:p-9 transition-all duration-300 ${variants[variant]}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              variant === "dark"
                ? "bg-white/10 text-(--gold-light)"
                : "bg-(--purple-lightest) text-(--purple-dark)"
            }`}
          >
            {icon}
          </div>

          <h3
            className={`text-xl sm:text-2xl font-bold ${
              variant === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        </div>

        <p
          className={`text-base sm:text-lg leading-relaxed ${
            variant === "dark" ? "text-white/85" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
