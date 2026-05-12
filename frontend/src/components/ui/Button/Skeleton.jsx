import clsx from "clsx";
import { memo } from "react";
import { skeletonVariants } from "./skeleton-variants";

const ButtonSkeleton = ({
  size = "md",
  shape = "rounded",
  fullWidth = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        skeletonVariants({ size, shape, fullWidth, className }),
        "border-(--gray-light) bg-(--gray-light)"
      )}
    />
  );
};

export default memo(ButtonSkeleton);
