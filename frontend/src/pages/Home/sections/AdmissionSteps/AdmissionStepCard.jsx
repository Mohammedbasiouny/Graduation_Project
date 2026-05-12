import { translateNumber } from "@/i18n/utils";

export default function AdmissionStepCard({
  index,
  title,
  description,
  icon: Icon,
}) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Icon & Number for large screens */}
      <div
        className={`hidden md:flex absolute top-1/2 -translate-y-1/2 ${
          isEven ? "left-0" : "right-0 flex-row-reverse"
        } flex items-center gap-4`}
      >
        {Icon && (
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-(--gold-main) to-(--gold-dark) flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
            <Icon className="text-white" size={24} />
          </div>
        )}
        <span className="text-white/30 font-bold text-2xl">
          {translateNumber(index + 1)}
        </span>
      </div>

      {/* Glass-effect Card */}
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center flex flex-col items-center shadow-lg hover:-translate-y-1 hover:scale-105 transition-transform duration-500">
        {/* Icon & Number for small screens */}
        <div className="flex md:hidden items-center gap-3 mb-3">
          {Icon && (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-(--gold-main) to-(--gold-dark) flex items-center justify-center shadow-md">
              <Icon className="text-white" size={22} />
            </div>
          )}
          <span className="text-white/30 font-bold text-lg">
            {translateNumber(index + 1)}
          </span>
        </div>

        <h3 className="text-white font-semibold text-lg md:text-xl mb-2 capitalize">
          {title}
        </h3>

        <p className="text-white/70 text-sm md:text-base leading-relaxed wrap-break-word">
          {description}
        </p>
      </div>
    </div>
  );
}
