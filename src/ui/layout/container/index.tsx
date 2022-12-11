import { useContext } from 'react';

import { AlertContext } from 'ui/alert/provider';
import LayoutHeader from 'ui/layout/header';

interface LayoutContainerProps {
  children?: JSX.Element[] | JSX.Element | string[] | string;
}

const LayoutContainer = ({ children = undefined }: LayoutContainerProps) => {
  const { alerts } = useContext(AlertContext);

  return (
    <div className="min-h-screen">
      <LayoutHeader />

      <div>
        {alerts.length !== 0 ? (
          <div className="fixed z-9999 top-24 right-4 flex flex-col gap-y-5">
            {alerts.map((alert, i) => {
              return <span key={i}>{alert}</span>;
            })}
          </div>
        ) : null}

        <div className="flex justify-center mt-10">{children}</div>
      </div>
    </div>
  );
};

export default LayoutContainer;
