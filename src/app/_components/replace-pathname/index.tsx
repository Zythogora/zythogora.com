"use client";

import { useEffect } from "react";

import { useRouter } from "@/lib/i18n";

interface ReplacePathnameProps {
  pathname: string;
}

const ReplacePathname = ({ pathname }: ReplacePathnameProps) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return null;
};

export default ReplacePathname;
