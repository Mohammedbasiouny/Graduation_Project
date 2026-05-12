import { memo, useEffect, useMemo, useRef, useState } from "react";

import HU_image from "@/assets/images/HU.png";
import room_image from "@/assets/images/room.png";
import indoor_hall_image from "@/assets/images/indoor_hall.png";
import dorms_image from "@/assets/images/dorms.png";
import HNU_image from "@/assets/images/HNU.png";
import { useMediaQuery } from "@/hooks/use-media-query.hook";

const positions = [
  "absolute top-4 ltr:left-4 rtl:right-4 w-[320px] h-[190px]",
  "absolute bottom-6 ltr:left-8 rtl:right-8 w-[350px] h-[220px]",
  "absolute top-20 left-1/2 -translate-x-1/2 w-[480px] h-[280px] z-10",
  "absolute top-6 ltr:right-6 rtl:left-6 w-[280px] h-[180px]",
  "absolute bottom-8 ltr:right-10 rtl:left-10 w-[260px] h-[160px]",
];

/* -------------------- Desktop Collage -------------------- */
const DesktopCollage = memo(function DesktopCollage({
  imagesList,
  index,
  blur,
}) {
  return (
    <div className="relative w-full h-130 isolate">
      {imagesList.map((src, imgIndex) => {
        const posIndex =
          (imgIndex - index + imagesList.length) % imagesList.length;

        return (
          <img
            key={src}
            src={src}
            alt={`Image ${imgIndex}`}
            loading="eager"
            className={`${positions[posIndex]}
              object-cover rounded-2xl shadow-lg
              ${blur ? "blur-sm" : "blur-0"}
            `}
          />
        );
      })}
    </div>
  );
});

/* -------------------- Mobile Image -------------------- */
const MobileImage = memo(function MobileImage({ imagesList, index, blur }) {
  return (
    <div className="flex justify-center relative w-full max-w-md h-65 sm:h-80">
      {imagesList.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Dormitory ${i}`}
          loading="eager"
          className={`absolute top-0 left-0 w-full h-full
            object-cover rounded-2xl shadow-lg
            transition-all duration-700
            ${blur && i === index ? "blur-[6px]" : ""}
            ${i === index ? "block" : "hidden"}
          `}
        />
      ))}
    </div>
  );
});


const ImageCollage = () => {
  const isDesktop = useMediaQuery("(min-width: 1536px)");

  const imagesList = useMemo(
    () => [HU_image, indoor_hall_image, room_image, dorms_image, HNU_image],
    []
  );

  const [index, setIndex] = useState(0);
  const [blur, setBlur] = useState(false);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // ✅ Interval for changing images
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBlur(true);

      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % imagesList.length);
        setBlur(false);
      }, 600);
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [imagesList.length]);

  return (
    <div className="2xl:block">
      {isDesktop ? (
        <DesktopCollage imagesList={imagesList} index={index} blur={blur} />
      ) : (
        <div className="w-full flex justify-center">
          <MobileImage imagesList={imagesList} index={index} blur={blur} />
        </div>
      )}
    </div>
  );
};

export default memo(ImageCollage);
