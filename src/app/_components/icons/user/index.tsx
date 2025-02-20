import type { IconProps } from "@/app/_components/icons/types";

const UserIcon = ({ size, ...restProps }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...restProps}
    >
      <circle cx="8" cy="5" r="3" />

      <circle cx="8" cy="17" r="8" />
    </svg>
  );
};

export default UserIcon;
