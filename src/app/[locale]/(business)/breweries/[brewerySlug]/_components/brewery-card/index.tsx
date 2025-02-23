import { getTranslations } from "next-intl/server";

import CountryFlag from "@/app/_components/icons/country-flag";
import DescriptionList from "@/app/_components/ui/description-list";

interface BreweryCardProps {
  name: string;
  country: {
    name: string;
    code: string;
  };
}

const BeerCard = async ({ name, country }: BreweryCardProps) => {
  const t = await getTranslations();

  return (
    <div className="bg-primary-50 dark:bg-primary-800 flex flex-col gap-y-6 overflow-hidden rounded border-2 p-8 drop-shadow">
      <h1 className="text-2xl">{name}</h1>

      <DescriptionList
        label={t("breweryPage.country")}
        value={
          <div className="flex flex-row items-center gap-x-2">
            <CountryFlag country={country} size={12} />

            <p className="text-xs">{country.name}</p>
          </div>
        }
        title={country.name}
      />
    </div>
  );
};

export default BeerCard;
