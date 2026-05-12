import { useLayoutStore } from '@/store/use-layout.store';
import TopBar from './TopBar'
import Footer from './Footer'
import Copyright from './Copyright'
import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Breadcrumbs from '../../ui/Breadcrumbs'

const RootLayout = () => {
  const { showTopBar, showNavbar, showCopyright, showBreadcrumbs, showFooter } = useLayoutStore();

  return (
    <div className="flex flex-col">
      {/* Header */}
      {showTopBar && (
        <div className="w-full">
          <TopBar />
        </div>
      )}
      {showNavbar && (
        <div className="w-full">
          <Navbar />
        </div>
      )}

      {/* Main content */}
      <main className="grow">
        {showBreadcrumbs && (
          <div className='p-5'>
            <Breadcrumbs />
          </div>
        )}
        
        <Outlet />
      </main>

      <div className="w-full">
        {showFooter && (
          <div className="w-full">
            <Footer />
          </div>
        )}
        {showCopyright && (
          <div className="w-full">
            <Copyright />
          </div>
        )}
      </div>
    </div>
  )
}

export default RootLayout
