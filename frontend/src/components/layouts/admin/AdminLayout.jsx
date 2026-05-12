import { useLayoutStore } from '@/store/use-layout.store';
import Copyright from '../common/Copyright';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import TopBar from '../common/TopBar';
import AdminSidebar from './AdminSidebar';
import Breadcrumbs from '../../ui/Breadcrumbs';

const AdminLayout = () => {
  const { showNavbar, showTopBar, showCopyright, showBreadcrumbs } = useLayoutStore();

  return (
    <div className='w-full flex'>

      <AdminSidebar />

      <div className="w-full flex flex-col">
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

        <main className="p-5 w-full flex flex-col bg-(--gray-lightest) min-h-screen">
          {showBreadcrumbs && (
            <Breadcrumbs />
          )}

          <Outlet />
        </main>

        {showCopyright && (
          <div className="w-full">
            <Copyright />
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminLayout
