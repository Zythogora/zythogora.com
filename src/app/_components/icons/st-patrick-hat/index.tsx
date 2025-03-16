import { cn } from "@/lib/tailwind";

import type { IconProps } from "@/app/_components/icons/types";

const StPatrickHatIcon = ({ size, className, ...restProps }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={cn(
        "overflow-visible stroke-stone-950 stroke-[0.5px]",
        className,
      )}
      {...restProps}
    >
      <path
        d="M14.1365 3.22121C14.1365 4.16723 11.3894 4.93358 8.0001 4.93358C4.61083 4.93358 1.86374 4.16725 1.86374 3.22121C1.86374 2.27518 4.61083 1.50885 8.0001 1.50885C11.3894 1.50885 14.1365 2.27518 14.1365 3.22121Z"
        className="fill-(--patrick-500)"
      />

      <path
        d="M13.4972 10.6687C13.4929 10.8235 13.4801 10.9826 13.4794 11.1367C13.4794 12.0955 12.0348 12.5984 10.4638 12.8342C10.2621 13.5011 9.64845 13.9911 8.91622 13.9911H7.08385C6.35162 13.9911 5.73869 13.5011 5.53627 12.8335C3.96596 12.5969 2.52063 12.0941 2.52063 11.1332C2.51921 10.9819 2.50643 10.8221 2.50217 10.668C0.990804 11.0728 0.0454407 11.6403 0.0454407 12.271C0.0454407 13.4968 3.60653 14.4911 7.99999 14.4911C12.3934 14.4911 15.9545 13.4975 15.9545 12.271C15.9545 11.6403 15.0093 11.0728 13.4972 10.6687Z"
        className="fill-(--patrick-500)"
      />

      <path
        d="M8.46175 11.0103L7.55977 10.9968L7.54556 11.8924L8.46176 11.9059L8.46175 11.0103Z"
        className="fill-(--patrick-500)"
      />

      <path
        d="M12.9959 11.1331C13.0016 10.5549 13.0236 9.9761 13.0684 9.40295C12.5328 9.72043 11.6159 9.98037 10.486 10.138C10.5187 10.2659 10.5407 10.3973 10.5407 10.5344V12.3326C12.008 12.089 12.9959 11.6423 12.9959 11.1331Z"
        className="fill-(--patrick-900)"
      />

      <path
        d="M3.00429 11.1331C3.00429 11.643 3.99009 12.089 5.45956 12.3334V10.5344C5.45956 10.3966 5.48158 10.2659 5.51425 10.138C4.38356 9.98037 3.46734 9.72043 2.93188 9.40295C2.97663 9.9761 2.99861 10.5549 3.00429 11.1331Z"
        className="fill-(--patrick-900)"
      />

      <path
        d="M13.8765 4.30212C12.6968 5.06065 10.2897 5.41718 8.00011 5.41718C5.71102 5.41647 3.30339 5.05994 2.12375 4.30212C2.36097 5.31491 2.69904 6.92849 2.87871 8.80921L3.17913 8.98748C3.62657 9.2531 4.51293 9.51945 5.7104 9.67712C5.99804 9.21832 6.50444 8.91079 7.08399 8.91079H8.91635C9.4966 8.91079 10.003 9.21903 10.2899 9.67712C11.4874 9.51945 12.3737 9.25312 12.8212 8.98748L13.1216 8.80921C13.3013 6.92776 13.6393 5.3134 13.8765 4.30212Z"
        className="fill-(--patrick-500)"
      />

      <path
        d="M8.91629 9.3938H7.08466C6.4554 9.3938 5.94333 9.90587 5.94333 10.5344V12.3668C5.94333 12.996 6.45611 13.5074 7.08466 13.5074H8.91629C9.54555 13.5074 10.0576 12.9953 10.0576 12.3668V10.5344C10.0576 9.90587 9.54484 9.3938 8.91629 9.3938ZM8.9447 12.3674C8.9447 12.3831 8.93192 12.3958 8.91558 12.3958L7.05485 12.3674L7.08397 10.5067L8.9447 10.5351V12.3674Z"
        className="fill-(--brand-500)"
      />
    </svg>
  );
};

export default StPatrickHatIcon;
