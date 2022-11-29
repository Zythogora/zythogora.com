import { createContext, useState } from 'react';

import { AlertContextType } from 'ui/alert/types';

export const AlertContext = createContext<AlertContextType>({
  alerts: [],
  alert: () => {},
});

interface AlertProviderProps {
  children: JSX.Element | JSX.Element[] | string | string[] | undefined;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alerts, setAlerts] = useState<JSX.Element[]>([]);

  return (
    <AlertContext.Provider
      value={{
        alerts: alerts,
        alert: (newAlert: JSX.Element, duration?: number) => {
          setAlerts([...alerts, newAlert]);

          setTimeout(
            () => {
              setAlerts(alerts?.filter((alert) => alert !== newAlert));
            },
            duration ? duration * 1000 : 5000,
          );
        },
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
