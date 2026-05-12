import { useState } from "react";
import white_UDORM_logo from "@/assets/logos/white_UDORM_logo.png";
import { useTranslation } from "react-i18next";
import { Briefcase, FileText, Home, Info, Menu, Phone, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import GuestButtons from "./GuestButtons";
import AuthButtons from "./AuthButtons";
import BrandLogo from "../BrandLogo";
import Drawer from "@/components/ui/Drawer";
import { useLanguage } from "@/i18n/use-language.hook";

const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isArabic } = useLanguage()
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: t("header:links.home"), to: "home", icon: Home },
    { name: t("header:links.apply_process"), to: "apply-process", icon: FileText },
    { name: t("header:links.about"), to: "about-us", icon: Info },
    { name: t("header:links.services"), to: "student-services", icon: Briefcase },
    { name: t("header:links.contact"), to: "contact-us", icon: Phone },
  ];

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (id) => {
    setMenuOpen(false);

    // ✅ If already on home → just scroll
    if (location.pathname === "/") {
      scrollToId(id);
      return;
    }

    // ✅ If not on home → go home with hash
    navigate(`/#${id}`);
  };

  return (
    <nav className="text-white text-[18px] font-bold w-full px-[3.5%] py-2.5 bg-(--navy-main) flex items-center justify-between shadow-xl sticky top-0 z-50">
      {/* Logo */}
      <BrandLogo logo={white_UDORM_logo} alt="white UDORM logo" />

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-7.5 font-semibold">
        {links.map(({ name, to }) => (
          <button
            key={to}
            onClick={() => handleNavClick(to)}
            className="hover:text-(--gold-main) transition-colors cursor-pointer"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <GuestButtons />
        <AuthButtons />

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex items-center justify-center p-2"
        >
          {menuOpen ? (
            <X size={30} className="cursor-pointer" />
          ) : (
            <Menu size={30} className="cursor-pointer" />
          )}
        </button>
      </div>

      {/* Drawer */}
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        position={isArabic ? "right" : "left"}
        bg="bg-(--navy-main)"
        width="w-[80%] max-w-sm"
      >
        {/* 🔥 Logo Section */}
        <div
          className="px-5 pt-10 pb-6 border-b border-white/10 flex items-center gap-3"
        >
          <div className="w-fit rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg shadow-inner">
            <BrandLogo logo={white_UDORM_logo} alt="white UDORM logo" />
          </div>

          <Link 
            to="/"
            className="text-lg font-bold tracking-wide text-white">
            {t("web_site_name")}
          </Link>
        </div>

        {/* 🔥 Navigation Links */}
        <div className="flex flex-col pt-10 px-6 gap-3">
          {links.map(({ name, to, icon: Icon }) => (
            <button
              key={to}
              onClick={() => handleNavClick(to)}
              className="
                group relative flex items-center gap-4
                text-start
                px-5 py-3 ltr:rounded-r-lg rtl:rounded-l-lg
                text-white/80 text-lg font-semibold
                transition-all duration-300
                hover:text-white hover:bg-white/10
                cursor-pointer
              "
            >
              {/* Hover glow */}
              <span className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Animated side bar */}
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 h-0 w-1 bg-white transition-all duration-300 group-hover:h-full" />

              {/* Icon */}
              <Icon
                size={20}
                className="relative z-10 opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
              />

              {/* Text */}
              <span className="relative z-10">
                {name}
              </span>
            </button>
          ))}
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
