interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Spinner = ({ size = 'medium', color }: SpinnerProps) => {
  let spinnerStyle;

  switch (size) {
    case 'small':
      spinnerStyle = 'w-8 h-8';
      break;
    case 'medium':
      spinnerStyle = 'w-12 h-12';
      break;
    case 'large':
      spinnerStyle = 'w-16 h-16';
      break;
  }

  const spinnerColor = color
    ? { borderColor: color, borderTopColor: 'transparent' }
    : {};

  return (
    <div
      className={`
        ${spinnerStyle} rounded-full
        border-4 border-solid border-primary border-t-transparent
        animate-spin
      `}
      style={spinnerColor}
    ></div>
  );
};

export default Spinner;
