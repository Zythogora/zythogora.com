import type {
  Acidity,
  AromasIntensity,
  Bitterness,
  BodyStrength,
  CarbonationIntensity,
  Duration,
  FlavorsIntensity,
  Haziness,
  HeadRetention,
  LabelDesign,
  PurchaseType,
  ServingFrom,
} from "@db/enums";

export interface ReviewFormDefaultValue {
  reviewId?: string;
  globalScore: number;
  servingFrom: ServingFrom;
  bestBeforeDate?: Date;
  comment?: string;
  pictureUrl?: string;
  labelDesign?: LabelDesign;
  haziness?: Haziness;
  headRetention?: HeadRetention;
  aromasIntensity?: AromasIntensity;
  flavorsIntensity?: FlavorsIntensity;
  bodyStrength?: BodyStrength;
  carbonationIntensity?: CarbonationIntensity;
  bitterness?: Bitterness;
  acidity?: Acidity;
  duration?: Duration;
  price?: number;
  priceCurrency?: string;
  purchaseType?: PurchaseType;
  purchaseLocationId?: string;
  purchaseLocationLabel?: string;
  purchaseStoreUrl?: string;
}
