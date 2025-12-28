"use client";

import { useState } from "react";

type GoogleAutocompleteSession = {
  token: string;
  generatedAt: Date;
};

export const useGoogleAutocompleteSession = () => {
  const [session, setSession] = useState<GoogleAutocompleteSession>({
    token: crypto.randomUUID(),
    generatedAt: new Date(),
  });

  const getSessionToken = () => {
    const now = new Date();

    // If the session is older than 3 minutes, generate a new one
    if (now.getTime() - session.generatedAt.getTime() > 180_000) {
      const newSession = {
        token: crypto.randomUUID(),
        generatedAt: now,
      };

      setSession(newSession);

      return newSession.token;
    }

    return session.token;
  };

  return { getSessionToken };
};
