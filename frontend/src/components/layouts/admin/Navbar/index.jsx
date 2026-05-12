import { useMediaQuery } from "@/hooks/use-media-query.hook";
import { SidebarToggleButton } from "../../../ui/Sidebar";
import BrandLogo from "../../common/BrandLogo";
import AuthButtons from "../../common/Navbar/AuthButtons";
import colored_UDORM_logo from "@/assets/logos/colored_UDORM_logo.png"

const Navbar = () => {
  const isDesktop = useMediaQuery("(max-width: 1536px)");
  return (
    <nav className="bg-white text-white text-[18px] font-bold w-full px-[3.5%] py-2.5 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <BrandLogo logo={colored_UDORM_logo} alt={"colored UDORM logo"} />

      <div className="flex gap-2 items-center">
        <AuthButtons />
        {isDesktop ? (<SidebarToggleButton />) : null}
      </div>
    </nav>
  );
};

export default Navbar;
