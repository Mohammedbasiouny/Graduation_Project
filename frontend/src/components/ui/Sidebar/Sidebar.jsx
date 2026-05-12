import { useEffect } from "react";
import { useSidebarStore } from "@/store/use-sidebar.store";
import MainSidebar from "./MainSidebar";
import MiniSidebar from "./MiniSidebar";
import Drawer from "@/components/ui/Drawer"; // ✅ الجديد
import { useLanguage } from "@/i18n/use-language.hook";

const Sidebar = ({ title, subtitle, children }) => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setSidebar = useSidebarStore((state) => state.setSidebar);
  const { isArabic } = useLanguage()

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSidebar(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSidebar]);

  return (
    <>
      {/* ✅ Large Screen Sidebar */}
      <MainSidebar title={title} subtitle={subtitle}>
        {children}
      </MainSidebar>

      {/* ✅ Medium Screen Mini Sidebar */}
      <MiniSidebar>
        {children}
      </MiniSidebar>

      {/* ✅ Mobile Sidebar (New Drawer) */}
      <Drawer
        open={isOpen}
        onClose={() => setSidebar(false)}
        position={isArabic ? "right" : "left"}
        bg="bg-white"
        width="max-w-[340px] min-w-[340px]"
      >
        {/* Header */}
        <div className="flex items-start justify-between mt-5 pb-5 border-b-2 border-(--gray-light)">
          <div className="text-[16px] space-y-2">
            <h2 className="font-bold text-(--primary-dark)">{title}</h2>
            <h3 className="font-semibold text-(--navy-deep)">{subtitle}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-1 overflow-y-auto">
          {children}
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;