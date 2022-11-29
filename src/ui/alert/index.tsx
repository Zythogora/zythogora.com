import classnames from 'classnames';

import { AlertType } from 'ui/alert/types';
import ErrorIcon from 'ui/assets/errorIcon';
import InfoIcon from 'ui/assets/infoIcon';
import SuccessIcon from 'ui/assets/successIcon';
import WarningIcon from 'ui/assets/warningIcon';

type AlertProps = {
  type: AlertType;
  title: string;
} & (
  | {
      compact?: true;
      description?: undefined;
    }
  | {
      compact: false;
      description: string;
    }
);

const Alert = ({
  type,
  title,
  compact = true,
  description = undefined,
}: AlertProps) => {
  const alertBaseStyle =
    'flex flex-row items-center w-[500px] border-[1px] rounded-lg';

  let alertCompactStyle;
  let iconCompactStyle;
  if (compact) {
    alertCompactStyle = 'py-2 px-3 gap-x-2';
    iconCompactStyle = 'w-3.5 h-3.5';
  } else {
    alertCompactStyle = 'py-5 px-6 gap-x-5';
    iconCompactStyle = 'w-6 h-6';
  }

  let alertTypeStyle;
  let icon;
  switch (type) {
    case AlertType.SUCCESS:
      alertTypeStyle = 'bg-[#f6ffed] border-[#b7eb8f]';
      icon = <SuccessIcon className={iconCompactStyle} />;
      break;
    case AlertType.INFO:
      alertTypeStyle = 'bg-[#e6f4ff] border-[#91caff]';
      icon = <InfoIcon className={iconCompactStyle} />;
      break;
    case AlertType.WARNING:
      alertTypeStyle = 'bg-[#fffbe6] border-[#ffe58f]';
      icon = <WarningIcon className={iconCompactStyle} />;
      break;
    case AlertType.ERROR:
      alertTypeStyle = 'bg-[#fff2f0] border-[#ffccc7]';
      icon = <ErrorIcon className={iconCompactStyle} />;
      break;
  }

  if (compact) {
    return (
      <div
        className={classnames(
          alertBaseStyle,
          alertTypeStyle,
          alertCompactStyle,
        )}
      >
        {icon}
        <h1 className="text-sm">{title}</h1>
      </div>
    );
  }

  return (
    <div
      className={classnames(alertBaseStyle, alertTypeStyle, alertCompactStyle)}
    >
      {icon}
      <div className="flex flex-col">
        <h1 className="text-base">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Alert;
