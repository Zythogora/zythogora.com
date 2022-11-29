import { Helmet, HelmetProvider } from 'react-helmet-async';

import { AlertProvider } from 'ui/alert/provider';
import LayoutContainer from 'ui/layout/container';

interface LayoutProps {
  title: string;
  description?: string;
  children?: JSX.Element[] | JSX.Element | string[] | string;
}

const Layout = ({
  title,
  description = undefined,
  children = undefined,
}: LayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      <AlertProvider>
        <LayoutContainer>{children}</LayoutContainer>
      </AlertProvider>
    </HelmetProvider>
  );
};

export default Layout;
