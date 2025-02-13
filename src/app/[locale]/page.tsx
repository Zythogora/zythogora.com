import { getTranslations } from "next-intl/server";

const HomePage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold">
        {t.rich("home.title", {
          br: () => <br />,
          highlight: (chunks) => (
            <span className="text-primary text-5xl">{chunks}</span>
          ),
        })}
      </h1>
    </div>
  );
};

export default HomePage;
