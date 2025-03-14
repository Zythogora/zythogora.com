"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/lib/i18n";

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  const t = useTranslations();

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      title={t("common.back")}
      className="cursor-pointer"
    >
      <ChevronLeftIcon className={className} />
    </button>
  );
};

export default BackButton;
