import clsx from "clsx";

const InputSkeleton = ({ className = "" }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className={clsx(
          "w-full h-[42px] md:h-[50px] rounded-lg",
          "border-(--gray-light) bg-(--gray-light) animate-pulse",
          className
        )}
      ></div>
    </div>
  );
};

export default InputSkeleton;
