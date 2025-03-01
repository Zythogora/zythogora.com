import type { IconProps } from "@/app/_components/icons/types";

export const LocationIcon = ({ size, ...restProps }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path d="M12.7384 2.73558C11.75 1.02628 9.97668 0.00292969 7.99994 0.00292969C4.97668 0.00292969 2.51733 2.46228 2.51733 5.48553C2.51733 6.44483 2.76734 7.36349 3.25572 8.21819L7.62204 15.7763C7.69762 15.91 7.84297 15.9973 7.99994 15.9973C8.15691 15.9973 8.30226 15.9159 8.37784 15.7763L12.7442 8.21819C13.7325 6.50306 13.7267 4.45651 12.7383 2.74135L12.7384 2.73558ZM11.9884 7.77632L7.9999 14.6775L4.01144 7.77632C3.59864 7.05539 3.38933 6.28215 3.38933 5.47977C3.38933 2.93912 5.4591 0.869348 7.99975 0.869348C9.66254 0.869348 11.151 1.72981 11.9823 3.16591C12.8137 4.60777 12.8195 6.3287 11.9823 7.77056L11.9884 7.77632ZM7.9999 2.52628C6.44176 2.52628 5.18018 3.79372 5.18018 5.35772C5.18018 6.92172 6.44762 8.17744 7.9999 8.17744C9.55218 8.17744 10.8196 6.91 10.8196 5.35772C10.8196 3.80544 9.55218 2.52628 7.9999 2.52628ZM7.9999 7.30544C6.92433 7.30544 6.05218 6.43335 6.05218 5.35772C6.05218 4.28209 6.92427 3.39846 7.9999 3.39846C9.07553 3.39846 9.94762 4.27638 9.94762 5.35772C9.94762 6.43906 9.07553 7.30544 7.9999 7.30544Z" />
    </svg>
  );
};
