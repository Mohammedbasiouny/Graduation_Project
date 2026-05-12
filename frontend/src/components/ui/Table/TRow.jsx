import { Children } from "react";
import { useMediaQuery } from "@/hooks/use-media-query.hook";

const TRow = ({ children }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <tr className="transition-all duration-200 even:bg-(--gray-light)/20 odd:bg-white hover:bg-(--gold-main)/10">
        {children}
      </tr>
    );
  }

  // When mobile — reorder so that any isMain elements come first
  const childArray = Children.toArray(children);
  const mainChildren = childArray.filter((child) => child.props?.isMain);
  const otherChildren = childArray.filter((child) => !child.props?.isMain);
  const orderedChildren = [...mainChildren, ...otherChildren];

  return (
    <div className="flex flex-col gap-2 bg-white hover:bg-(--gold-main)/10 transition">
      {orderedChildren}
    </div>
  );
};

export default TRow;
