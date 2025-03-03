"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useRef, useState } from "react";

import CountryFlag from "@/app/_components/icons/country-flag";
import LinkIcon from "@/app/_components/icons/link";
import { LocationIcon } from "@/app/_components/icons/location";
import SocialIcon from "@/app/_components/icons/social";
import { getSocialIconType } from "@/app/_components/icons/social/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import DescriptionList from "@/app/_components/ui/description-list";
import { cn } from "@/lib/tailwind";
import { useMediaQuery } from "@/lib/tailwind/hooks";

import type { Brewery } from "@/domain/breweries/types";

interface BreweryCardProps {
  brewery: Brewery;
}

const BreweryCard = ({ brewery }: BreweryCardProps) => {
  const t = useTranslations();

  const hasDetails =
    brewery.websiteLink !== undefined ||
    (brewery.socialLinks !== undefined && brewery.socialLinks.length > 0) ||
    brewery.contactEmail !== undefined ||
    brewery.contactPhoneNumber !== undefined;

  const [isExpandable, setIsExpandable] = useState(hasDetails);

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (descriptionRef.current && !isExpandable) {
      setIsExpandable(
        isMobile
          ? // Description is truncated
            descriptionRef.current.scrollHeight > 64
          : descriptionRef.current.scrollHeight > 80,
      );
    }
  }, [isMobile, descriptionRef, isExpandable, setIsExpandable]);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible
      asChild
      open={isExpanded}
      onOpenChange={setIsExpanded}
      disabled={!isExpandable}
    >
      <CollapsibleTrigger
        className={cn(
          "@container/brewery-card",
          "relative isolate rounded-none",
          "before:bg-foreground before:absolute before:inset-0 before:-bottom-0.5 before:z-[-1]",
          "md:before:rounded",
          "focus-visible:-outline-offset-2 md:focus-visible:rounded md:focus-visible:outline-offset-0",
          {
            "cursor-pointer": isExpandable,
          },
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start",
            "gap-y-6 border-b-2 p-8 md:gap-y-8 md:rounded md:border-2 md:px-12 md:py-10",
            "bg-primary-50 dark:bg-primary-800",
          )}
        >
          {isExpandable ? (
            <div className="bg-foreground absolute bottom-1.5 left-[calc(50%-theme(spacing.8))] h-1 w-16 rounded-full opacity-50" />
          ) : null}

          <h1 className="w-full text-center text-2xl md:text-4xl">
            {brewery.name}
          </h1>

          <div
            className={cn(
              "grid w-full",
              "gap-x-6 md:gap-x-8",
              "grid-cols-[minmax(0,1fr)_max-content] @lg/brewery-card:grid-cols-[minmax(0,1fr)_0.5fr]",
            )}
          >
            <DescriptionList
              label={t("breweryPage.location")}
              value={
                <>
                  <CountryFlag
                    country={brewery.location.country}
                    size={14}
                    className="size-3 md:size-3.5"
                  />

                  <p className="truncate">
                    {brewery.location.country.name}

                    {brewery.location.state ? (
                      <>, {brewery.location.state}</>
                    ) : null}

                    {brewery.location.city ? (
                      <>, {brewery.location.city}</>
                    ) : null}
                  </p>
                </>
              }
              title={[
                brewery.location.country.name,
                brewery.location.state,
                brewery.location.city,
              ]
                .filter((val) => val !== undefined)
                .join(", ")}
              className={cn(
                "*:data-[slot=description-details]:flex *:data-[slot=description-details]:w-full *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-center",
                "*:data-[slot=description-details]:gap-x-1.5 md:*:data-[slot=description-details]:gap-x-2",
              )}
            />

            {brewery.creationYear ? (
              <DescriptionList
                label={t("breweryPage.creationYear")}
                value={brewery.creationYear}
                className="mr-8 @lg/brewery-card:mr-0"
              />
            ) : null}
          </div>

          {brewery.description ? (
            <p
              ref={descriptionRef}
              className={cn("text-left", "text-xs md:text-sm", {
                "line-clamp-4": !isExpanded,
              })}
            >
              {(() => {
                const lines = brewery.description.split("\n");

                return lines.map((str, index) => (
                  <Fragment key={index}>
                    {str}

                    {index !== lines.length - 1 ? <br /> : null}
                  </Fragment>
                ));
              })()}
            </p>
          ) : null}

          {hasDetails ? (
            <CollapsibleContent
              className={cn("contents", "text-xs md:text-sm")}
            >
              {brewery.websiteLink ? (
                <div className="flex flex-row items-center gap-x-2">
                  <LinkIcon
                    size={14}
                    className={cn("fill-foreground", "size-3 md:size-3.5")}
                  />

                  <a href={brewery.websiteLink} target="_blank">
                    {brewery.websiteLink}
                  </a>
                </div>
              ) : null}

              {brewery.socialLinks ? (
                <ul className="flex flex-col gap-y-2">
                  {brewery.socialLinks.map((socialLink) => (
                    <li
                      key={socialLink.name}
                      className={cn(
                        "flex flex-row items-center",
                        "gap-x-1.5 md:gap-x-2",
                      )}
                    >
                      <SocialIcon
                        type={getSocialIconType(socialLink.url)}
                        size={14}
                        className={cn("fill-foreground", "size-3 md:size-3.5")}
                      />

                      <a
                        href={
                          socialLink.url.startsWith("http")
                            ? socialLink.url
                            : `https://${socialLink.url}`
                        }
                        target="_blank"
                      >
                        {socialLink.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}

              {brewery.contactEmail ? (
                <div
                  className={cn(
                    "flex flex-row items-center",
                    "gap-x-1.5 md:gap-x-2",
                  )}
                >
                  <MailIcon
                    size={14}
                    className={cn("fill-foreground", "size-3 md:size-3.5")}
                  />

                  <a href={`mailto:${brewery.contactEmail}`}>
                    {brewery.contactEmail}
                  </a>
                </div>
              ) : null}

              {brewery.contactPhoneNumber ? (
                <div
                  className={cn(
                    "flex flex-row items-center",
                    "gap-x-1.5 md:gap-x-2",
                  )}
                >
                  <PhoneIcon
                    size={14}
                    className={cn("fill-foreground", "size-3 md:size-3.5")}
                  />

                  <a href={`tel:${brewery.contactPhoneNumber}`}>
                    {brewery.contactPhoneNumber}
                  </a>
                </div>
              ) : null}

              {brewery.location.address ? (
                <div
                  className={cn(
                    "flex flex-row items-center",
                    "gap-x-1.5 md:gap-x-2",
                  )}
                >
                  <LocationIcon
                    size={14}
                    className="fill-foreground size-3 md:size-3.5"
                  />

                  <p>{brewery.location.address}</p>
                </div>
              ) : null}
            </CollapsibleContent>
          ) : null}
        </div>
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export default BreweryCard;
