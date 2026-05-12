export default function AlertScreen({ title, description, Icon }) {
  return (
    <div className="flex flex-col justify-center items-center text-center 
                    w-full px-6 md:px-10 py-20">

      {/* Icon */}
      {Icon && (
        <div className="border-2 border-(--yellow-dark) bg-(--yellow-lightest) rounded-full 
                        p-4 md:p-6 mb-4 flex items-center justify-center">
          <Icon className="w-32 h-32 text-(--yellow-dark)" />
        </div>
      )}

      {/* Title */}
      {title && (
        <h2 className="text-4xl font-semibold text-(--primary-dark)">
          {title}
        </h2>
      )}

      {/* Description */}
      {description && (
        <p className="text-lg text-(--gray-dark) mt-3 max-w-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
