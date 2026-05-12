import { Outlet } from "react-router";
import TopBar from "../common/TopBar";
import Copyright from "../common/Copyright";
import DecorativeWaveOverlay from "./DecorativeWaveOverlay";
import FloatingLogoBlob from "./FloatingLogoBlob";
import AuthHero from "./AuthHero";
import { useLayoutStore } from "@/store/use-layout.store";

const AuthLayout = () => {
  const { showTopBar, showCopyright } = useLayoutStore();


  return (
    <div className="flex flex-col min-h-screen xl:h-screen">

    {showTopBar && <TopBar />}

    <main className="flex-1 flex">
      <div className="w-full flex rtl:flex-row-reverse flex-1">

        {/* Left Side - Hero */}
        <div
          className="
            hidden xl:flex
            items-center justify-center
            relative
            w-1/2
            bg-(--navy-main)
            [clip-path:ellipse(100%_100%_at_0%_50%)]
            overflow-hidden
          "
        >
          <DecorativeWaveOverlay />
          <FloatingLogoBlob />
          <AuthHero />
        </div>

        {/* Right Side - Form */}
        <div className="p-5 w-full xl:w-1/2 flex items-center justify-center bg-white h-full">
          <div className="w-full max-w-xl flex flex-col gap-6">
            <Outlet />
          </div>
        </div>

      </div>
    </main>

    {showCopyright && <Copyright />}

    </div>
  );
};

export default AuthLayout