import type { IconProps } from "@/app/_components/icons/types";

const PintIcon = ({ size, ...restProps }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        data-slot="path-background"
        d="M6 11L5 6H19L18 11L17.5 23H6.5L6 11Z"
      />

      <path
        data-slot="path-foreground"
        d="M5 6C5 4.00871 6 1 6 1H18C18 1 19 4.00871 19 6M5 6C5 7.99129 5.7004 9.03138 6 11C6.7057 15.637 6.5 23 6.5 23H17.5C17.5 23 17.2943 15.637 18 11C18.2996 9.03138 19 7.99129 19 6M5 6H19"
      />
    </svg>
  );
};

export default PintIcon;
