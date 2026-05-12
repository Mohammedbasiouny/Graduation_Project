import clsx from "clsx";

const FloatingLogoBubble = ({
  image,
  alt = "Floating Logo",
  size = "w-44 h-44",
  imgSize = "w-24 h-24",
  position = "top-1/5 right-20",
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "absolute bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm",
        position,
        size,
        className
      )}
    >
      <img
        src={image}
        alt={alt}
        className={clsx("object-contain drop-shadow-lg", imgSize)}
      />
    </div>
  );
};

export default FloatingLogoBubble;
