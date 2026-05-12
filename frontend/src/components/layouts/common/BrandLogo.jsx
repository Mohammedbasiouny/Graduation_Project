import { Link } from "react-router";

const BrandLogo = ({ logo, alt = "logo" }) => {
  return (
    <Link to={"/"}>
      <img
        src={logo}
        alt={alt}
        className="w-10 sm:w-13.75 h-10 sm:h-13.75"
      />
    </Link>
  )
}

export default BrandLogo
