import { Link } from "react-router";

const RedirectText = ({ text, linkText, linkTo, centerText, underlineText = false}) => {
  return (
    <p className={`${centerText && "text-center" } text-gray-500 text-sm sm:text-base md:text-base lg:text-base`}>
      {text && `${text} `}
      <Link 
        to={linkTo} 
        className={`text-blue-600 hover:underline ${underlineText && "underline" } text-sm sm:text-base md:text-base lg:text-base font-semibold`}
      >
        {linkText}
      </Link>
    </p>
  );
};

export default RedirectText;
