import { Menu, X } from "lucide-react";
import { useSidebarStore } from "@/store/use-sidebar.store";

const SidebarToggleButton = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setSidebar = useSidebarStore((state) => state.setSidebar);

  return (
    <button
      onClick={() => setSidebar(!isOpen)}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
    >
      {isOpen ? (
        <X className="w-6 h-6 text-(--primary-dark)" />
      ) : (
        <Menu className="w-6 h-6 text-(--primary-dark)" />
      )}
    </button>
  );
};

export default SidebarToggleButton;
