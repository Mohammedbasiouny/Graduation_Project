import { cva } from "class-variance-authority";

export const skeletonVariants = cva(
  "inline-flex items-center justify-center font-semibold border-[2px] animate-pulse select-none",
  {
    variants: {
      size: {
        xs: "h-[24px] w-[60px] rounded-[4px]",
        sm: "h-[28px] w-[80px] rounded-[6px]",
        md: "h-[36px] w-[100px] rounded-[8px]",
        lg: "h-[44px] w-[120px] rounded-[10px]",
        xl: "h-[52px] w-[160px] rounded-[12px]",
      },
      shape: {
        square: "rounded-none",
        rounded: "",
        pill: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      size: "lg",
      shape: "rounded",
    },
  }
);