import { getTranslations } from "next-intl/server";

interface BreweryTabLoaderProps {
  search: string;
}

const BreweryTabLoader = async ({ search }: BreweryTabLoaderProps) => {
  const t = await getTranslations();

  return <p>{t("searchPage.breweries.searching", { search })}</p>;
};

export default BreweryTabLoader;
