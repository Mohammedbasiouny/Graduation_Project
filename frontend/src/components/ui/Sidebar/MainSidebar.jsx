import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react'
import { useLanguage } from '@/i18n/use-language.hook';

const MainSidebar = ({ title, subtitle, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { isArabic } = useLanguage()

  return (
    <aside
      className={`
        hidden 2xl:flex flex-col gap-5 h-screen
        bg-white border-(--gray-light)
        shadow-[0_2px_10px_rgba(0,0,0,0.05)]
        transition-all duration-300 sticky top-0 left-0
        ${isOpen ? "max-w-85 min-w-85 px-5 py-10 ltr:border-r-2 rtl:border-l-2" : "relative max-w-0 min-w-0 px-0 py-0 border-0"}  `}
    >

      {/* Sidebar Content */}
      <div
        className={`
          flex-1 overflow-y-hidden hover:overflow-y-auto transition-all duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="text-[18px] space-y-2 pb-5 border-b-2 border-(--gray-light)">
          <h2 className="font-bold text-(--primary-dark)">{title}</h2>
          <h3 className="font-semibold text-(--navy-deep)">{subtitle}</h3>
        </div>
        <div className="space-y-1 mt-3 ltr:mr-2 rtl:ml-2">{children}</div>
      </div>

      {/* Center Half-Pill Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute top-1/2 -translate-y-1/2 ltr:-right-8 rtl:-left-8
          w-8 h-12
          bg-(--primary-dark) text-white
          rtl:rounded-l-lg ltr:rounded-r-lg
          shadow-md
          flex items-center justify-center
          transition cursor-pointer
        `}
      >
        {isOpen
          ? isArabic ? <ChevronRight size={20} /> : <ChevronLeft size={20} />
          : isArabic ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      
    </aside>
  )
}

export default MainSidebar
