import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  `
  inline-flex items-center justify-center relative font-bold
  border-2
  transition-all duration-200 ease-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  active:scale-[0.97]
  disabled:pointer-events-none disabled:opacity-60
  select-none whitespace-nowrap
  shadow-sm hover:shadow-md
  cursor-pointer
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-(--navy-main) text-white border-(--navy-main)
          hover:bg-(--navy-deep) hover:border-(--navy-deep)
          focus-visible:ring-(--navy-main)/40
        `,
        secondary: `
          bg-(--gold-main) text-white border-(--gold-main)
          hover:bg-(--gold-dark) hover:border-(--gold-dark)
          focus-visible:ring-(--gold-main)/40
        `,
        info: `
          bg-(--blue-dark) text-white border-(--blue-dark)
          hover:bg-(--blue-light) hover:text-(--blue-dark) hover:border-(--blue-light)
          focus-visible:ring-(--blue-dark)/40
        `,
        warning: `
          bg-(--yellow-light) text-(--yellow-dark) border-(--yellow-light)
          hover:bg-(--yellow-dark) hover:text-white hover:border-(--yellow-dark)
          focus-visible:ring-(--yellow-dark)/40
        `,
        error: `
          bg-(--red-light) text-(--red-dark) border-(--red-light)
          hover:bg-(--red-dark) hover:text-white hover:border-(--red-dark)
          focus-visible:ring-(--red-dark)/40
        `,
        success: `
          bg-(--green-dark) text-white border-(--green-dark)
          hover:bg-(--green-light) hover:text-(--green-dark) hover:border-(--green-light)
          focus-visible:ring-(--green-dark)/40
        `,
        danger: `
          bg-(--red-dark) text-white border-(--red-dark)
          hover:bg-(--red-light) hover:text-(--red-dark) hover:border-(--red-light)
          focus-visible:ring-(--red-dark)/40
        `,
        cancel: `
          bg-(--gray-light) text-(--gray-dark) border-(--gray-light)
          hover:bg-(--gray-dark) hover:text-white hover:border-(--gray-dark)
          focus-visible:ring-(--gray-dark)/35
        `,
        black: `
          bg-(--primary-dark) text-white border-(--primary-dark)
          hover:bg-(--gray-dark) hover:border-(--gray-dark)
          focus-visible:ring-(--primary-dark)/40
        `,
        outline: `
          bg-transparent border-(--navy-main) text-(--navy-main)
          hover:bg-(--navy-deep) hover:text-white hover:border-(--navy-deep)
          focus-visible:ring-(--navy-main)/35
        `,
        "outline-white": `
          bg-transparent border-white text-white
          hover:bg-white hover:text-(--navy-main) hover:border-white
          focus-visible:ring-white/40
        `,
      },

      size: {
        xs: `
          text-[14px] px-3 py-1.5 min-h-[32px] min-w-[70px] rounded-[6px]
        `,
        sm: `
          text-[15px] px-4 py-2 min-h-[38px] min-w-[90px] rounded-[8px]
        `,
        md: `
          text-[16px] px-5 py-2.5 min-h-[44px] min-w-[110px] rounded-[10px]
        `,
        lg: `
          text-[17px] px-7 py-3 min-h-[50px] min-w-[140px] rounded-[12px]
        `,
        xl: `
          text-[19px] px-9 py-3.5 min-h-[58px] min-w-[170px] rounded-[14px]
        `,
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
      variant: "primary",
      size: "lg",
      shape: "rounded",
    },
  }
);
