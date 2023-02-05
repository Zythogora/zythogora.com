export type TabName = string;

export type TabContent = JSX.Element[] | JSX.Element | string[] | string | null;

export type Tabs = {
  [key: TabName]: TabContent;
};
