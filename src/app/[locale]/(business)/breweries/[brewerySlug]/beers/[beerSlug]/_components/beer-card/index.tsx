import { getTranslations } from "next-intl/server";

import CountryFlag from "@/app/_components/icons/country-flag";
import PintIcon from "@/app/_components/icons/pint";
import DescriptionList from "@/app/_components/ui/description-list";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface BeerCardProps {
  name: string;
  brewery: {
    slug: string;
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
  style: string;
  abv: number;
  ibu?: number;
  color: {
    name: string;
    hex: string;
  };
}

const BeerCard = async ({
  name,
  brewery,
  style,
  abv,
  ibu,
  color,
}: BeerCardProps) => {
  const t = await getTranslations();

  return (
    <div className="bg-primary-50 dark:bg-primary-800 flex flex-col gap-y-6 overflow-hidden rounded rounded-t-xl border-2 p-8 drop-shadow">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl">{name}</h1>

        <div className="flex flex-row items-center gap-x-2">
          <CountryFlag country={brewery.country} size={12} />

          <p className="gap-x-inter-space flex min-w-0 flex-row text-xs text-nowrap">
            {t.rich("beerPage.brewedBy", {
              brewery: brewery.name,
              link: (chunks) => (
                <Link
                  href={generatePath(Routes.BREWERY, {
                    brewerySlug: brewery.slug,
                  })}
                  title={brewery.name}
                  className="text-primary truncate"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 items-center justify-between gap-x-4">
        <DescriptionList
          label={t("beerPage.style")}
          value={style}
          className="col-span-2 [&>dd]:truncate"
          title={style}
        />

        <div className="flex items-center justify-center">
          <PintIcon color={color} size={28} className="size-7" />
        </div>

        <DescriptionList
          label={t("beerPage.abv")}
          value={`${abv}%`}
          className={ibu ? "" : "col-start-5"}
        />

        {ibu ? <DescriptionList label={t("beerPage.ibu")} value={ibu} /> : null}
      </div>
    </div>
  );
};

export default BeerCard;
