"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/lib/i18n";

interface BackButtonProps {
  fallbackRoute: string;
  className?: string;
}

const BackButton = ({ fallbackRoute, className }: BackButtonProps) => {
  const t = useTranslations();

  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
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
