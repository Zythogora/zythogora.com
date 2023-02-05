import { createContext, useState } from 'react';

import { AlertContextType } from 'ui/alert/types';

export const AlertContext = createContext<AlertContextType>({
  alerts: [],
  triggerAlert: () => {},
});

interface AlertProviderProps {
  children: JSX.Element | JSX.Element[] | string | string[] | undefined;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alerts, setAlerts] = useState<JSX.Element[]>([]);

  const triggerAlert = (newAlert: JSX.Element, duration?: number) => {
    setAlerts([...alerts, newAlert]);

    setTimeout(
      () => {
        setAlerts(alerts?.filter((a) => a !== newAlert));
      },
      duration ? duration * 1000 : 5000,
    );
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        triggerAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
