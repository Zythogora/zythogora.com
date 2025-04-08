import type { IconProps } from "@/app/_components/icons/types";

const OpenSourceIcon = ({ size, ...restProps }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...restProps}
    >
      <path d="m32 8c13.3 0 24 10.7 24 24 0 13.3-10.7 24-24 24-13.3 0-24-10.7-24-24 0-13.3 10.7-24 24-24z" />

      <path d="m14.6 48.6l0.8 0.8-6 6-0.8-0.8z" />

      <path d="m20 20h12" />

      <path d="m20 44h12" />

      <path d="m44 26h-24" />

      <path d="m40 38h-20" />

      <path d="m48 32h-28" />
    </svg>
  );
};

export default OpenSourceIcon;
