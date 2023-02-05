import { useState } from 'react';

import TabTitle from 'ui/tabView/tabName';
import { TabName, Tabs } from 'ui/tabView/types';

interface TabViewProps {
  tabs: Tabs;
  defaultTab?: TabName;
}

const TabView = ({ tabs, defaultTab }: TabViewProps) => {
  const tabNames = Object.keys(tabs);

  if (tabNames.length === 0) {
    return null;
  }

  const [selectedTab, setSelectedTab] = useState<TabName>(
    defaultTab || tabNames[0],
  );

  return (
    <div className="w-256 p-12 bg-white dark:bg-gray-700 rounded-xl">
      <div className="flex flex-row gap-x-6 pb-12 border-b dark:border-gray-500">
        {tabNames.map((tabName) => (
          <TabTitle
            key={tabName}
            name={tabName}
            selected={tabName === selectedTab}
            setSelected={setSelectedTab}
          />
        ))}
      </div>

      <div className="mt-12">{tabs[selectedTab]}</div>
    </div>
  );
};

export default TabView;
