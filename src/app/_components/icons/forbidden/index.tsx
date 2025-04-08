import type { IconProps } from "@/app/_components/icons/types";

const ForbiddenIcon = ({ size, ...restProps }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...restProps}
    >
      <path d="m32 8c13.3 0 24 10.7 24 24 0 13.3-10.7 24-24 24-13.3 0-24-10.7-24-24 0-13.3 10.7-24 24-24z" />

      <path d="m17.4 47.4l-0.8-0.8 30-30 0.8 0.8z" />
    </svg>
  );
};

export default ForbiddenIcon;
