import { getTranslations } from "next-intl/server";

import BreweryBeerLoader from "@/app/[locale]/(business)/(app-with-header)/breweries/[brewerySlug]/_components/brewery-beer/loader";

const BreweryBeerListLoader = async () => {
  const t = await getTranslations();

  return (
    <div className="flex w-full flex-col gap-y-4">
      <p>{t("breweryPage.beers.loading")}</p>

      <div className="flex flex-col gap-y-8">
        <BreweryBeerLoader nameLength={16} styleLength={11} hasIbu />

        <BreweryBeerLoader nameLength={25} styleLength={14} hasIbu />

        <BreweryBeerLoader nameLength={13} styleLength={9} />

        <BreweryBeerLoader nameLength={19} styleLength={12} hasIbu />
      </div>
    </div>
  );
};

export default BreweryBeerListLoader;
