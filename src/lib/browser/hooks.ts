"use client";

import { useEffect, useState } from "react";

export const usePlatformDetection = () => {
  const [isDetected, setIsDetected] = useState<boolean>(false);
  const [isMac, setIsMac] = useState<boolean>(false);

  useEffect(() => {
    setIsDetected(true);
    setIsMac(
      navigator.userAgentData?.platform === "macOS" ||
        /Macintosh|Mac OS X/i.test(navigator.userAgent),
    );
  }, []);

  return { isDetected, isMac };
};
