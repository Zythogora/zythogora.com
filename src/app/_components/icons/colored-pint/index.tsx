import SparkleIcon from "@/app/_components/icons/sparkle";
import { cn } from "@/lib/tailwind";

import type { IconProps } from "@/app/_components/icons/types";
import type { Color } from "@/domain/beers/types";
import type { CSSProperties } from "react";

interface ColoredPintProps extends IconProps {
  beerFillClassName?: string;
  unknownColor?: boolean;
  alt?: string;
}

const ColoredPint = ({
  size,
  beerFillClassName,
  unknownColor = false,
  alt,
  ...restProps
}: ColoredPintProps) => {
  return (
    <div className="relative size-fit" title={alt}>
      <svg
        aria-label={alt}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        {...restProps}
      >
        {/* As the head is transparent, we do not need this path (at the moment)
        <path d="M5 6L6 1H18L19 6H5Z" /> */}

        <path
          d="M6 11L5 6H19L18 11L17.5 23H6.5L6 11Z"
          className={cn(beerFillClassName, {
            "fill-[url(#unknown-color)]": unknownColor,
          })}
        />

        <path
          d="M5 6C5 4.00871 6 1 6 1H18C18 1 19 4.00871 19 6M5 6C5 7.99129 5.7004 9.03138 6 11C6.7057 15.637 6.5 23 6.5 23H17.5C17.5 23 17.2943 15.637 18 11C18.2996 9.03138 19 7.99129 19 6M5 6H19"
          className="stroke-foreground"
          strokeWidth={(2 / size) * 24}
        />

        <defs>
          <linearGradient
            id="unknown-color"
            x1="5"
            y1="6"
            x2="17.5"
            y2="23"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00821B" />

            <stop offset="0.25" stopColor="#00821B" />

            <stop offset="0.25" stopColor="#004BFF" />

            <stop offset="0.5" stopColor="#004BFF" />

            <stop offset="0.5" stopColor="#780089" />

            <stop offset="0.75" stopColor="#780089" />

            <stop offset="0.75" stopColor="#E60000" />

            <stop offset="1" stopColor="#E60000" />
          </linearGradient>
        </defs>
      </svg>

      {unknownColor ? (
        <>
          <SparkleIcon
            size={(size * 7) / 24}
            className="absolute top-7/24 left-7/24 size-7/24 fill-white"
          />

          <SparkleIcon
            size={(size * 5) / 24}
            className="absolute top-2/3 left-[calc(9.5/24*100%)] size-5/24 fill-white"
          />

          <SparkleIcon
            size={(size * 3) / 24}
            className="absolute top-[calc(12.5/24*100%)] left-13/24 size-3/24 fill-white"
          />
        </>
      ) : null}
    </div>
  );
};

interface ColoredPintIconProps extends IconProps {
  color: Color;
}

const ColoredPintIcon = ({ color, ...restProps }: ColoredPintIconProps) => {
  if (color.name === "Other") {
    return <ColoredPint alt={color.name} unknownColor {...restProps} />;
  }

  return (
    <ColoredPint
      alt={color.name}
      beerFillClassName="fill-[var(--beer-color)]"
      style={{ "--beer-color": `#${color.hex}` } as CSSProperties}
      {...restProps}
    />
  );
};

export default ColoredPintIcon;
