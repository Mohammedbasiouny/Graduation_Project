import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
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
        <RouterProvider router={routers} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ScrollToTop />
      <LanguageSwitcher />
      <ToastContainer style={{ zIndex: 999999 }} />
      <ServerErrorPopup />
    </>
  );
}