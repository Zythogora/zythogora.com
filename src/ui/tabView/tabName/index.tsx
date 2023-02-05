import { TabName } from 'ui/tabView/types';

interface TabProps {
  name: TabName;
  selected: boolean;
  setSelected: React.Dispatch<TabName>;
}

const TabTitle = ({ name, selected, setSelected }: TabProps) => {
  const tabTitleStyle = selected
    ? 'bg-gray-700 text-gray-50 dark:bg-gray-200 dark:text-gray-900'
    : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-50';

  return (
    <div
      className={`px-8 py-4 rounded-full shadow-md cursor-pointer ${tabTitleStyle}`}
      onClick={() => {
        setSelected(name);
      }}
    >
      {name}
    </div>
  );
};

export default TabTitle;
