import { getTranslations } from "next-intl/server";

import BeerSearchResult from "@/app/[locale]/(business)/(search)/search/_components/beer-result";
import { searchBeers } from "@/domain/search";

interface SearchPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const t = await getTranslations();

  const { search } = await searchParams;

  if (!search) {
    return <p>{t("searchPage.beers.noSearch")}</p>;
  }

  const beerResults = await searchBeers(search);

  if (beerResults.length === 0) {
    return <p>{t("searchPage.beers.noResults")}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <p>{t("searchPage.beers.results", { count: beerResults.length })}</p>

      <div className="flex w-full flex-col gap-y-8">
        {beerResults.map((beerResult) => (
          <BeerSearchResult
            key={beerResult.id}
            name={beerResult.name}
            brewery={{
              name: beerResult.brewery.name,
              countryCode: beerResult.brewery.countryAlpha2Code,
            }}
            style={beerResult.style.name}
            abv={beerResult.abv}
            ibu={beerResult.ibu ?? undefined}
            color={
              beerResult.color.name !== "Other"
                ? beerResult.color.hex
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
