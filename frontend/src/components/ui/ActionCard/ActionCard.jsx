import clsx from "clsx";

const ActionCard = ({
  title = "Action Title",
  description = "Short description of this action.",
  icon: Icon,
  children = null,
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "w-full min-h-47.5 bg-white rounded-2xl border border-(--gray-light) shadow-md",
        "flex flex-col gap-5 justify-between p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {Icon && <Icon className="shrink-0 text-(--primary-dark)" size={36} />}
        <div>
          <h3 className="text-[18px] font-bold text-(--primary-dark) leading-tight">
            {title}
          </h3>
          <p className="text-[14px] font-semibold text-(--gray-dark)/80 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Footer / Children */}
      {children}
    </div>
  );
};

export default ActionCard;
