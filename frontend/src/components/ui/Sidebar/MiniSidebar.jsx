import { cloneElement } from 'react';
import { useSidebarStore } from '@/store/use-sidebar.store';

const MiniSidebar = ({ children }) => {
  const setSidebar = useSidebarStore((state) => state.setSidebar);

  return (
    <aside
      className={`
        hidden md:flex 2xl:hidden flex-col gap-5 items-center py-15
        w-18.75 h-screen bg-white ltr:border-r-2
        rtl:border-l-2 border-(--gray-light) sticky top-0 left-0
        shadow-[0_2px_10px_rgba(0,0,0,0.05)]
      `}
      onMouseEnter={() => setSidebar(true)}
    >
      {(Array.isArray(children) ? children : [children]).map(
        (child, idx) =>
          child.props?.icon ? (
            <button
              key={idx}
              onClick={() => setSidebar(true)}
              className="group relative flex items-center justify-center 
                        w-12 h-12 rounded-[10px] text-(--navy-main)
                        hover:bg-(--navy-main) hover:text-white
                        transition-all duration-150 ease-out hover:scale-105 
                        hover:shadow-md cursor-pointer"
            >
              {cloneElement(child.props.icon, {
                className:
                  "w-[24px] h-[24px] transition-transform duration-150",
              })}
            </button>
          ) : null
      )}
    </aside>
  )
}

export default MiniSidebar
