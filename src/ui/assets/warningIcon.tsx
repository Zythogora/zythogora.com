import classNames from 'classnames';

/*
  Link: https://ant.design/
*/

interface WarningIconProps {
  fill?: string;
  className?: string;
}

const WarningIcon = ({
  fill = '#faad14',
  className = '',
}: WarningIconProps) => {
  return (
    <div className={className}>
      <svg
        width="1em"
        height="1em"
        viewBox="64 64 896 896"
        className="w-full h-full"
        style={{ fill }}
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
      </svg>
    </div>
  );
};

export default WarningIcon;