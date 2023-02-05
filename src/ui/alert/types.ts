export enum AlertType {
  SUCCESS,
  INFO,
  WARNING,
  ERROR,
}

export type AlertContextType = {
  alerts: JSX.Element[];
  triggerAlert: (newAlert: JSX.Element, duration?: number) => void;
};
