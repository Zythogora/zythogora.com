"use client";

import { nanoid } from "nanoid";
import { useCallback, useState, useRef } from "react";

const SESSION_TIMEOUT = 180_000; // 3 minutes

type GoogleAutocompleteSession = {
  token: string;
  generatedAt: Date;
};

export const useGoogleAutocompleteSession = () => {
  const generateToken = useCallback(() => {
    return crypto?.randomUUID ? crypto.randomUUID() : nanoid();
  }, []);

  const [session, setSession] = useState<GoogleAutocompleteSession>({
    token: generateToken(),
    generatedAt: new Date(),
  });

  const sessionRef = useRef<GoogleAutocompleteSession>(session);

  const getSessionToken = useCallback(() => {
    const now = new Date();
    const currentSession = sessionRef.current;

    if (
      now.getTime() - currentSession.generatedAt.getTime() >
      SESSION_TIMEOUT
    ) {
      const newSession = {
        token: generateToken(),
        generatedAt: now,
      };

      sessionRef.current = newSession;
      setSession(newSession);

      return newSession.token;
    }

    return currentSession.token;
  }, []);

  return { getSessionToken };
};
