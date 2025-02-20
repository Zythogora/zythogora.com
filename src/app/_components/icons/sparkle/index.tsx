import type { IconProps } from "@/app/_components/icons/types";

const SparkleIcon = ({ size, ...restProps }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...restProps}
    >
      <path d="M3 3C2.12676 3.87324 0 4 0 4C0 4 2.12676 4.12676 3 5C3.87324 5.87324 4 8 4 8C4 8 4.12676 5.87324 5 5C5.87324 4.12676 8 4 8 4C8 4 5.87324 3.87324 5 3C4.12676 2.12676 4 0 4 0C4 0 3.87324 2.12676 3 3Z" />
    </svg>
  );
};

export default SparkleIcon;
