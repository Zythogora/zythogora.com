export enum AlertType {
  SUCCESS,
  INFO,
  WARNING,
  ERROR,
}

export type AlertContextType = {
  alerts: JSX.Element[];
  alert: (newAlert: JSX.Element, duration?: number) => void;
};
