import { getTranslations } from "next-intl/server";

interface BeerTabLoaderProps {
  search: string;
}

const BeerTabLoader = async ({ search }: BeerTabLoaderProps) => {
  const t = await getTranslations();

  return <p>{t("searchPage.beers.searching", { search })}</p>;
};

export default BeerTabLoader;
