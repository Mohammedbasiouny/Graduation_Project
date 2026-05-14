import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Suspense } from 'react';
import { RouterProvider } from "react-router";
import routers from './routes/index.route';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ScrollToTop from './components/ui/ScrollToTop';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import { ToastContainer } from 'react-toastify';
import LoadingScreen from './components/screens/LoadingScreen';
import ServerErrorPopup from './pages/common/modals/ServerErrorPopup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,

      // refetch 3 times every 3 minutes
      refetchInterval: (data, query) => {
        const count = query?.state?.dataUpdateCount ?? 0;

        if (count >= 3) return false; // stop after 3

        return 1000 * 60 * 3; // 3 minutes
      },
    },
  },
});

export default function App() {
  return (
    <>
      <LoadingScreen />
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-white text-[var(--navy-main)]">
              <div className="rounded-2xl border border-[rgba(19,32,145,0.12)] bg-white px-6 py-4 shadow-lg">
                جاري تحميل الصفحة...
              </div>
            </div>
          }
        >
          <RouterProvider router={routers} />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ScrollToTop />
      <LanguageSwitcher />
      <ToastContainer style={{ zIndex: 999999 }} />
      <ServerErrorPopup />
    </>
  );
}