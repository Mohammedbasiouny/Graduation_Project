import { NavLink } from "react-router";
import clsx from "clsx";

const FlyoutItem = ({
  to,
  Icon,
  title,
  description,
  bg = "transparent",
  textColor = "text-black",
  ...rest
}) => {

  const commonClasses = `
    flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer
  `;

  const Content = (
    <div
      className={clsx(commonClasses, bg, textColor)}
      {...rest}
    >
      {Icon && <Icon className={`${textColor}`} />}

      <div>
        <p className={`font-semibold`}>{title}</p>
        {description ? <p className={`text-${textColor}/50 text-sm`}>{description}</p> : null}
      </div>
    </div>
  );

  return to ? (
    <NavLink to={to} className="block">
      {Content}
    </NavLink>
  ) : (
    Content
  );
};

export default FlyoutItem;
