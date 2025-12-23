"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";

import HasVerifiedEmail from "@/app/[locale]/(business)/(with-header)/_components/has-verified-email";
import HeaderSearchBar from "@/app/[locale]/(business)/(with-header)/_components/header/search-bar";
import HomeLargeCard from "@/app/[locale]/(home)/_components/large-card";
import HomeSmallCard from "@/app/[locale]/(home)/_components/small-card";
import Bubbles from "@/app/_components/bubbles";
import ForbiddenIcon from "@/app/_components/icons/forbidden";
import OpenSourceIcon from "@/app/_components/icons/open-source";
import PintIcon from "@/app/_components/icons/pint";
import ReviewIcon from "@/app/_components/icons/review";
import QueryClientProvider from "@/app/_components/providers/query-client-provider";
import Button from "@/app/_components/ui/button";
import { Toaster } from "@/app/_components/ui/sonner";
import UserMenu, { UserMenuTrigger } from "@/app/_components/user-menu";
import Wave from "@/app/_components/wave";
import { cn } from "@/lib/tailwind";

const HomePage = () => {
  const t = useTranslations();

  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const onFocus = () => {
    setSearchBarOpen(true);
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
  };

  const onLeave = () => {
    setSearchBarOpen(false);
    document.body.style.overflow = "auto";
  };

  // Reset the body overflow when the page is unmounted
  useEffect(
    () => () => {
      document.body.style.overflow = "auto";
    },
    [],
  );

  return (
    <div className="relative isolate flex flex-col overflow-x-clip scroll-smooth bg-stone-50">
      <Toaster forceTheme="light" position="bottom-center" richColors />

      <Suspense>
        <HasVerifiedEmail />
      </Suspense>

      <div className="absolute inset-x-0 top-0 flex flex-row items-center justify-between p-8">
        <p className="font-title text-2xl font-semibold tracking-wide text-stone-950 uppercase">
          Zythogora
        </p>

        <Suspense fallback={<UserMenuTrigger />}>
          <UserMenu />
        </Suspense>
      </div>

      <Bubbles className="z-10" />

      <div className="flex h-screen w-full flex-col-reverse">
        <div className="bg-primary h-[calc(50vh-(--spacing(6)))]" />

        <Wave className="fill-primary h-12" />
      </div>

      <div
        data-open={searchBarOpen}
        className="group font-title text-3xl font-semibold"
      >
        <div className="pointer-events-none absolute inset-0 z-30 bg-stone-950/0 transition-all duration-500 group-data-[open=true]:bg-stone-950/75" />

        <div
          className={cn(
            "absolute top-[calc(50vh-(--spacing(8)))] left-[calc(50vw-(--spacing(8)))]",
            "transition-all duration-500",
            "-rotate-5 xl:-rotate-10",
            "-translate-x-1/2 xl:-translate-x-[calc((--spacing(64))+100%-5ch)]",
            "-translate-y-[calc(100%+(--spacing(20)))] xl:-translate-y-[calc(theme(lineHeight.9)+(--spacing(2))+(--spacing(24)))]",
            "group-data-[open=true]:translate-y-0",
            "group-data-[open=true]:rotate-5 xl:group-data-[open=true]:rotate-10",
            "group-data-[open=true]:top-56 xl:group-data-[open=true]:top-32",
          )}
        >
          <p className="text-primary grid grid-cols-[repeat(2,auto)] gap-x-2 text-nowrap">
            <span>{t("home.callouts.search.common")}</span>

            <span>{t("home.callouts.search.beers")}</span>

            <span className="col-start-2 mt-1 text-xl font-medium">
              {t("home.callouts.search.breweries")}
            </span>

            <span className="col-start-2 text-xl font-medium">
              {t("home.callouts.search.users")}
            </span>
          </p>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className={cn(
              "stroke-primary absolute top-0 left-0 size-20 origin-top-left overflow-visible fill-none",
              "transition-all duration-500",
              "translate-x-[5ch] translate-y-[calc(theme(lineHeight.9)+(--spacing(2)))]",
              "rotate-40 xl:rotate-20",
              "group-data-[open=true]:translate-x-8",
              "group-data-[open=true]:left-1/2 xl:group-data-[open=true]:left-full",
              "group-data-[open=true]:-translate-y-2 xl:group-data-[open=true]:translate-y-1/2",
              "group-data-[open=true]:rotate-[-130deg] xl:group-data-[open=true]:rotate-[-110deg]",
            )}
            strokeLinecap="round"
          >
            <path d="M 0 0 C 2 15 7 16 20 20 M 20 20 C 17 21 14 20 14 20 M 16 16 C 16 16 18 17 20 20" />
          </svg>
        </div>

        <QueryClientProvider>
          <HeaderSearchBar
            onFocus={onFocus}
            onLeave={onLeave}
            className={cn(
              "font-paragraph z-50 text-base font-normal",
              "absolute left-[50vw] -translate-x-1/2",
              "w-[calc(100%-(--spacing(16)))] md:w-lg",
              "transition-all duration-500",
              "top-[50vh] group-data-[open=true]:top-6",
              "-translate-y-1/2 group-data-[open=true]:translate-y-0",
              "dark:**:data-[slot=input]:border-stone-300",
              "dark:**:data-[slot=input-container]:before:bg-stone-300",
            )}
          />
        </QueryClientProvider>

        <div
          className={cn(
            "absolute top-[50vh] left-[calc(50vw+(--spacing(64)))]",
            "-translate-x-64 translate-y-8 rotate-25 xl:translate-x-0 xl:translate-y-0 xl:rotate-0",
            "transition-all duration-500",
            "group-data-[open=true]:opacity-0",
          )}
        >
          <div
            className={cn(
              "absolute",
              "top-14 -left-12 rotate-30",
              "xl:top-12 xl:-left-4 xl:rotate-65",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className={cn(
                "absolute top-0 left-0 overflow-visible fill-none stroke-stone-50",
                "size-36 stroke-[0.6px]",
                "xl:size-48 xl:stroke-[0.4px]",
              )}
              strokeLinecap="round"
            >
              <path d="M 0 0 C 2 15 7 16 20 20 M 20 20 C 17 21 14 20 14 20 M 16 16 C 16 16 18 17 20 20" />
            </svg>

            <p
              className={cn(
                "absolute origin-top -translate-x-1/2 text-center text-nowrap text-stone-50",
                "top-[calc((--spacing(36))+(--spacing(2)))] left-[calc((--spacing(36))+(--spacing(4)))] -rotate-72 text-2xl",
                "xl:top-[calc((--spacing(48))+(--spacing(1)))] xl:left-[calc((--spacing(48))+(--spacing(2)))] xl:-rotate-70 xl:text-3xl",
              )}
            >
              {t.rich("home.callouts.createCollections", {
                br: () => <br />,
              })}
            </p>
          </div>

          <div
            className={cn(
              "absolute",
              "top-4 left-9 rotate-30",
              "xl:top-11 xl:left-5 xl:rotate-50",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 10"
              className={cn(
                "absolute top-0 left-0 overflow-visible fill-none stroke-stone-50",
                "h-15 w-27 stroke-[0.7px]",
                "xl:h-20 xl:w-36 xl:stroke-[0.5px]",
              )}
              strokeLinecap="round"
            >
              <path d="M 0 0 C 10 0 14 2 17 10 M 17 10 C 14 9 13 8 13 8 M 17 5 C 17 5 18 7 17 10" />
            </svg>

            <p
              className={cn(
                "absolute origin-top -translate-x-1/2 text-center text-nowrap text-stone-50",
                "top-[calc(--spacing(1)*15+(--spacing(3)))] left-[calc(--spacing(1)*27+(--spacing(1)))] -rotate-25 text-2xl",
                "xl:top-[calc(--spacing(20)+(--spacing(4)))] xl:left-36 xl:-rotate-26 xl:text-3xl",
              )}
            >
              {t.rich("home.callouts.writeReviews", {
                br: () => <br />,
              })}
            </p>
          </div>

          <div
            className={cn(
              "absolute",
              "-top-6 left-30 rotate-35",
              "xl:top-4 xl:left-9 xl:rotate-30",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 21"
              className={cn(
                "absolute top-0 left-0 overflow-visible fill-none stroke-stone-50",
                "h-56 w-80 stroke-[0.4px]",
                "xl:h-63 xl:w-90 xl:stroke-[0.3px]",
              )}
              strokeLinecap="round"
            >
              <path d="M 0 0 C 23 0 26 8 28 21 M 28 21 C 25 19 24 17 24 17 M 30 16 C 30 16 30 18 28 21" />
            </svg>

            <p
              className={cn(
                "absolute origin-top -translate-x-1/2 text-center text-nowrap text-stone-50",
                "top-[calc(56*(--spacing(1))+(--spacing(4)))] left-[calc(80*(--spacing(1))-(--spacing(3)))] -rotate-10 text-2xl",
                "xl:top-[calc(--spacing(56)+(--spacing(12)))] xl:left-[calc(84*(--spacing(1))+(--spacing(1)))] xl:-rotate-9 xl:text-3xl",
              )}
            >
              {t.rich("home.callouts.shareThem", {
                br: () => <br />,
              })}
            </p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "bg-primary flex flex-col items-center justify-center gap-y-32",
          "pt-48 pb-16 xl:pt-0 xl:pb-48",
        )}
      >
        <h1 className="z-20 text-center text-5xl font-bold">
          {t.rich("home.whatsZythogora", {
            br: () => <br />,
            highlight: (chunks) => (
              <span className="text-background text-7xl">{chunks}</span>
            ),
          })}
        </h1>

        <div
          className={cn(
            "z-20 grid gap-x-16",
            "w-[calc(100%-(--spacing(16)))] grid-cols-none grid-rows-[auto_minmax(0,1fr)] gap-y-8",
            "xl:w-3/5 xl:grid-cols-3 xl:grid-rows-none xl:gap-y-16",
          )}
        >
          <HomeLargeCard
            text={t.rich("home.largeCards.first", {
              br: () => <br />,
            })}
            Icon={PintIcon}
            iconClassName={cn(
              "**:data-[slot=path-foreground]:stroke-foreground **:data-[slot=path-foreground]:fill-transparent",
              "**:data-[slot=path-background]:fill-primary",
            )}
          />

          <HomeLargeCard
            text={t("home.largeCards.second")}
            Icon={ReviewIcon}
            iconClassName={cn(
              "**:data-[slot=path-foreground]:fill-foreground",
              "**:data-[slot=path-background]:fill-primary",
            )}
          />
        </div>

        <div className="z-20 flex w-full flex-col items-center justify-center gap-y-16">
          <div
            className={cn(
              "grid grid-rows-[calc(--spacing(16)+(--spacing(32)))_auto_minmax(0,1fr)] justify-items-center gap-8",
              "w-[calc(100%-(--spacing(16)))] xl:w-4/5",
              "grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-3",
            )}
          >
            <HomeSmallCard
              icon={
                <>
                  <ForbiddenIcon size={128} />

                  <p className="font-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-normal">
                    $
                  </p>
                </>
              }
              title={t.rich("home.smallCards.free.title", {
                br: () => <br />,
              })}
              description={t.rich("home.smallCards.free.description", {
                br: () => <br />,
              })}
            />

            <HomeSmallCard
              icon={
                <>
                  <ForbiddenIcon size={128} />

                  <p className="font-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                    {t("home.smallCards.adFree.iconPlaceholder")}
                  </p>
                </>
              }
              title={t.rich("home.smallCards.adFree.title", {
                br: () => <br />,
              })}
              description={t.rich("home.smallCards.adFree.description", {
                br: () => <br />,
              })}
            />

            <HomeSmallCard
              icon={<OpenSourceIcon size={128} />}
              title={t.rich("home.smallCards.openSource.title", {
                br: () => <br />,
              })}
              description={t.rich("home.smallCards.openSource.description", {
                br: () => <br />,
              })}
            />
          </div>

          <div
            className={cn(
              "flex flex-col items-center justify-center gap-y-4",
              "w-full px-4 sm:w-xl",
            )}
          >
            <p className="text-center">{t("home.donate.description")}</p>

            <Button variant="outline" asChild>
              <a
                href="https://ko-fi.com/H2H71CK4OH"
                target="_blank"
                className="focus-visible:outline-foreground w-fit gap-x-4"
              >
                <Image
                  src="https://storage.ko-fi.com/cdn/brandasset/v2/kofi_symbol.png"
                  alt={t("home.donate.cta")}
                  width={321}
                  height={258}
                  className="w-8"
                />

                {t("home.donate.cta")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
