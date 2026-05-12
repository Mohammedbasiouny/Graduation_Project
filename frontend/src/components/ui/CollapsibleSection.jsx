import Heading from "@/components/ui/Heading";
import { ChevronDown, ChevronUp } from "lucide-react";
import useCollapsible from "@/hooks/use-collapsible.hook";

const CollapsibleSection = ({ title, subtitle, children, defaultCollapsed = true }) => {
  const {
    collapsed,
    toggle,
    contentRef,
    maxHeight,
  } = useCollapsible(!defaultCollapsed, [children]);

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 md:p-10 transition">
      {/* Header with Collapse Toggle */}
      <div
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={toggle}
      >
        <div className="flex flex-col gap-1">
          <Heading size="sm" align="start" title={title} subtitle={subtitle} />
        </div>
        <div className="text-gray-500 transition-transform duration-300">
          {collapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        style={{ maxHeight: maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="pt-8">
          {children}
        </div>
      </div>
    </section>
  );
};

export default CollapsibleSection;