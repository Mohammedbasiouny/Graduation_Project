import clsx from "clsx";
import { useMediaQuery } from '@/hooks/use-media-query.hook';

const TData = ({ children = null, column = "", isMain = false, isAppear = true, className = "", ...rest }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop  ? (
        isAppear ? (
          <td className={clsx("py-4 px-4.5 text-[15px] text-(--primary-dark)", className)} {...rest}>
            {children}
          </td>
        ) : null
      ) : (
        isMain ? (
          <p className="text-(--primary-dark) font-semibold text-[16px]">
            {children}
          </p>
        ) : (
          <p className={clsx("text-[14px] text-(--primary-dark)/80", className)}>
            <span className="font-semibold">{column}:</span>{" "}{children}
          </p>
        )
      )}
    </>
  )
}

export default TData
