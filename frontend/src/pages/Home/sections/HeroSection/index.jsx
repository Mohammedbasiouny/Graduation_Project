import React from "react";
import ImageCollage from "./ImageCollage";
import TextCollage from "./TextCollage";
import StatsCards from "./StatsCards";

const HeroSection = () => {
  return (
    <section id="home" className="relative w-full min-h-[calc(100vh-122px)] py-12 overflow-hidden bg-linear-to-b from-white to-gray-50">
      {/* Background Glow */}
      <div className="absolute -top-32 ltr:-left-32 rtl:-right-32 w-105 h-105 bg-(--gold-dark)/20 rounded-full blur-[120px]" />

      <div className="w-full px-[5%] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* RIGHT SIDE – TEXT (OPTIONAL) */}
        <TextCollage />

        {/* LEFT SIDE – IMAGE COLLAGE */}
        <div>
          <ImageCollage />
        </div>

        <StatsCards />
      </div>
    </section>
  );
};

export default HeroSection;
