"use client";

import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import { LoaderCircleIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { searchAction } from "@/app/[locale]/(business)/(with-header)/_components/header/search-bar/actions";
import BeerSearchResult from "@/app/[locale]/(business)/(without-header)/search/_components/tab/beer/result";
import BrewerySearchResult from "@/app/[locale]/(business)/(without-header)/search/_components/tab/brewery/result";
import UserSearchResult from "@/app/[locale]/(business)/(without-header)/search/_components/tab/user/result";
import { SEARCH_KINDS } from "@/app/[locale]/(business)/(without-header)/search/types";
import Input from "@/app/_components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/app/_components/ui/popover";
import Tab from "@/app/_components/ui/tab";
import { usePlatformDetection } from "@/lib/browser/hooks";
import { Link, usePathname, useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

import type { SearchKind } from "@/app/[locale]/(business)/(without-header)/search/types";
import type { ChangeEvent, FocusEvent } from "react";

interface HeaderSearchBarProps {
  className?: string;
  onFocus?: VoidFunction;
  onLeave?: VoidFunction;
}

const HeaderSearchBar = ({
  className,
  onFocus,
  onLeave,
}: HeaderSearchBarProps) => {
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [searchKind, setSearchKind] = useState<SearchKind>("beer");

  const [resultsVisible, setResultsVisible] = useState(false);

  const [inputHasFocus, setInputHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const current = inputRef.current;

    const focus = () => {
      setInputHasFocus(true);
      onFocus?.();
    };
    const blur = (e: FocusEvent<HTMLInputElement>) => {
      setInputHasFocus(false);
      if (e.target.value === "") {
        setResultsVisible(false);
      }
    };

    if (current) {
      current.addEventListener("focus", focus);
      current.addEventListener("blur", (e) =>
        blur(e as unknown as FocusEvent<HTMLInputElement>),
      );
    }

    return () => {
      if (current) {
        current.removeEventListener("focus", focus);
        current.removeEventListener("blur", (e) =>
          blur(e as unknown as FocusEvent<HTMLInputElement>),
        );
      }
    };
  }, [inputRef, onFocus]);

  useEffect(() => {
    if (!resultsVisible && !inputHasFocus) {
      onLeave?.();
    }
  }, [onLeave, resultsVisible, inputHasFocus]);

  useEffect(() => {
    // Unfocus the input if the user navigates to a new page
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setResultsVisible(false);
  }, [pathname]);

  const platform = usePlatformDetection();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Open the search bar when the user presses ⌘K or Ctrl+K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          setResultsVisible(true);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { isPending, data: searchResults } = useQuery({
    queryFn: () => searchAction(search),
    queryKey: ["search", search],
    staleTime: Number.POSITIVE_INFINITY,
  });

  const debouncedSearch = useDebouncedCallback(
    (search: string) => setSearch(search),
    300,
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setResultsVisible(e.target.value !== "");
  };

  const handleTabClick = (searchKind: SearchKind) => {
    setSearchKind(searchKind);
  };

  return (
    <>
      <Popover open={resultsVisible} onOpenChange={setResultsVisible}>
        <PopoverAnchor className={className}>
          <Command shouldFilter={false}>
            <div className="relative">
              <div className="absolute top-1/2 left-5 z-50 -translate-y-1/2">
                {search !== "" && isPending ? (
                  <LoaderCircleIcon className="text-foreground-muted mb-0.5 size-[21.34px] animate-spin" />
                ) : (
                  <SearchIcon size={24} className="text-foreground size-6" />
                )}
              </div>

              <Command.Input asChild>
                <Input
                  ref={inputRef}
                  onChange={handleSearchChange}
                  onFocus={() => setResultsVisible(true)}
                  className={cn(
                    "before:rounded-full",
                    "*:data-[slot=input]:rounded-full *:data-[slot=input]:pl-13",
                    "sm:*:data-[slot=input]:pr-22",
                  )}
                />
              </Command.Input>

              {platform.isDetected && !inputHasFocus ? (
                <kbd
                  className={cn(
                    "font-title border-foreground absolute top-1/2 right-6 -translate-y-1/2 flex-row items-center rounded border-2 px-2 py-1 opacity-25",
                    "bg-stone-200 dark:bg-stone-800",
                    "hidden sm:flex",
                    platform.isMac ? "gap-x-1" : "gap-x-0.5",
                  )}
                >
                  {platform.isMac ? (
                    <span className="flex h-4 flex-col justify-center text-base">
                      ⌘
                    </span>
                  ) : (
                    <>
                      <span className="text-xs">Ctrl</span>

                      <span className="text-xs">+</span>
                    </>
                  )}

                  <span className="text-xs">K</span>
                </kbd>
              ) : null}
            </div>

            {search !== "" && (searchResults || isPending) ? (
              <PopoverContent
                align="start"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={cn(
                  "p-0",
                  "ml-0 w-[calc(100vw-theme(spacing.16)+theme(spacing.1))] md:ml-7 md:w-[calc(var(--radix-popper-anchor-width)-theme(spacing.14))]",
                )}
              >
                <Command.List
                  className={cn(
                    "rounded px-3 py-4",
                    "bg-background dark:bg-stone-700",
                    "*:[&[cmdk-list-sizer]]:flex *:[&[cmdk-list-sizer]]:flex-col *:[&[cmdk-list-sizer]]:gap-y-4",
                    "**:data-[slot=search-bar-item]:cursor-pointer **:data-[slot=search-bar-item]:rounded",
                    "**:data-[slot=search-bar-item]:data-[selected=true]:outline-primary **:data-[slot=search-bar-item]:data-[slot=search-bar-item]:data-[selected=true]:outline-3 **:data-[slot=search-bar-item]:data-[slot=search-bar-item]:data-[selected=true]:-outline-offset-3",
                  )}
                >
                  <div className="flex flex-row gap-x-3 px-3 pt-3">
                    {SEARCH_KINDS.map((searchTab) => (
                      <Tab
                        key={searchTab}
                        active={searchKind === searchTab}
                        onClick={() => handleTabClick(searchTab)}
                      >
                        {t(`headerSearch.${searchTab}.tabName`)}
                      </Tab>
                    ))}
                  </div>

                  <div className="flex flex-col">
                    <p className="px-3 py-2 text-base">
                      {isPending
                        ? t(`headerSearch.${searchKind}.searching`, {
                            search,
                          })
                        : t(`headerSearch.${searchKind}.results`, {
                            count: searchResults?.[searchKind].count,
                          })}
                    </p>

                    {searchKind === "beer"
                      ? searchResults?.beer.results.map((beer) => (
                          <Command.Item
                            key={beer.id}
                            onSelect={() => {
                              router.push(
                                generatePath(Routes.BEER, {
                                  brewerySlug: beer.brewery.slug,
                                  beerSlug: beer.slug,
                                }),
                              );
                            }}
                            data-slot="search-bar-item"
                            className="p-1.5"
                            asChild
                          >
                            <Link
                              href={generatePath(Routes.BEER, {
                                brewerySlug: beer.brewery.slug,
                                beerSlug: beer.slug,
                              })}
                            >
                              <BeerSearchResult
                                name={beer.name}
                                brewery={beer.brewery}
                                style={beer.style}
                                abv={beer.abv}
                                ibu={beer.ibu}
                                color={beer.color}
                              />
                            </Link>
                          </Command.Item>
                        ))
                      : searchKind === "brewery"
                        ? searchResults?.brewery.results.map((brewery) => (
                            <Command.Item
                              key={brewery.id}
                              onSelect={() => {
                                router.push(
                                  generatePath(Routes.BREWERY, {
                                    brewerySlug: brewery.slug,
                                  }),
                                );
                              }}
                              data-slot="search-bar-item"
                              className="p-1.5 pl-3"
                              asChild
                            >
                              <Link
                                href={generatePath(Routes.BREWERY, {
                                  brewerySlug: brewery.slug,
                                })}
                              >
                                <BrewerySearchResult
                                  key={brewery.id}
                                  name={brewery.name}
                                  location={{ country: brewery.country }}
                                  beerCount={brewery.beerCount}
                                />
                              </Link>
                            </Command.Item>
                          ))
                        : searchKind === "user"
                          ? searchResults?.user.results.map((user) => (
                              <Command.Item
                                key={user.id}
                                onSelect={() => {
                                  router.push(
                                    generatePath(Routes.PROFILE, {
                                      username: user.username,
                                    }),
                                  );
                                }}
                                data-slot="search-bar-item"
                                className="p-1.5 pl-3"
                                asChild
                              >
                                <Link
                                  href={generatePath(Routes.PROFILE, {
                                    username: user.username,
                                  })}
                                >
                                  <UserSearchResult
                                    key={user.id}
                                    username={user.username}
                                    reviewCount={user.reviewCount}
                                  />
                                </Link>
                              </Command.Item>
                            ))
                          : null}
                  </div>

                  {searchResults ? (
                    searchResults[searchKind].count > 3 ? (
                      <Command.Item
                        onSelect={() => {
                          router.push(
                            `${Routes.SEARCH}?search=${search}&kind=${searchKind}`,
                          );
                        }}
                        data-slot="search-bar-item"
                        className="mx-auto w-fit px-3 py-2"
                        asChild
                      >
                        <Link
                          href={`${Routes.SEARCH}?search=${search}&kind=${searchKind}`}
                          className="text-primary-700 dark:text-primary underline"
                        >
                          {t(`headerSearch.${searchKind}.seeMore`, {
                            count: searchResults?.[searchKind].count - 3,
                          })}
                        </Link>
                      </Command.Item>
                    ) : searchKind === "beer" || searchKind === "brewery" ? (
                      <Command.Item
                        onSelect={() =>
                          router.push(
                            {
                              beer: Routes.CREATE_BEER,
                              brewery: Routes.CREATE_BREWERY,
                            }[searchKind],
                          )
                        }
                        data-slot="search-bar-item"
                        className="mx-auto w-fit px-3 py-2"
                        asChild
                      >
                        <Link
                          href={
                            {
                              beer: Routes.CREATE_BEER,
                              brewery: Routes.CREATE_BREWERY,
                            }[searchKind]
                          }
                          className="text-primary-700 dark:text-primary underline"
                        >
                          {t(`headerSearch.${searchKind}.create`)}
                        </Link>
                      </Command.Item>
                    ) : null
                  ) : null}
                </Command.List>
              </PopoverContent>
            ) : null}
          </Command>
        </PopoverAnchor>
      </Popover>
    </>
  );
};

export default HeaderSearchBar;
