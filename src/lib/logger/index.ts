import { SpanStatusCode, trace } from "@opentelemetry/api";

export const addToSpan = (
  attributes: Record<string, string | number | boolean | null | undefined>,
) => {
  const span = trace.getActiveSpan();
  if (!span) return;

  const filtered: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== null && value !== undefined) {
      filtered[key] = value;
    }
  }

  span.setAttributes(filtered);
};

export const recordError = (error: unknown) => {
  const span = trace.getActiveSpan();
  if (!span) return;

  if (error instanceof Error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  } else {
    span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
  }
};

interface SpanUser {
  id: string;
  username: string;
  createdAt: Date;
  reviewCount: number;
  uniqueBeerCount: number;
}

export const addUserToSpan = (user: SpanUser) => {
  const accountAgeDays = Math.floor(
    (Date.now() - user.createdAt.getTime()) / 86_400_000,
  );

  addToSpan({
    "user.id": user.id,
    "user.username": user.username,
    "user.account_age_days": accountAgeDays,
    "user.review_count": user.reviewCount,
    "user.unique_beer_count": user.uniqueBeerCount,
  });
};

interface SpanReview {
  beerId: string;
  globalScore: number;
  servingFrom: string;
  bestBeforeDate?: Date;
  comment?: string;
  picture?: unknown;
  labelDesign?: string;
  haziness?: string;
  headRetention?: string;
  aromasIntensity?: string;
  flavorsIntensity?: string;
  bodyStrength?: string;
  carbonationIntensity?: string;
  bitterness?: string;
  acidity?: string;
  duration?: string;
  price?: number;
  priceCurrency?: string;
  purchaseType: string;
}

export const addReviewToSpan = (review: SpanReview) => {
  addToSpan({
    "review.beer_id": review.beerId,
    "review.global_score": review.globalScore,
    "review.serving_from": review.servingFrom,
    "review.best_before_date": review.bestBeforeDate?.toISOString(),
    "review.has_comment": review.comment != null && review.comment.length > 0,
    "review.comment": review.comment,
    "review.has_picture": review.picture != null,
    "review.label_design": review.labelDesign,
    "review.haziness": review.haziness,
    "review.head_retention": review.headRetention,
    "review.aromas_intensity": review.aromasIntensity,
    "review.flavors_intensity": review.flavorsIntensity,
    "review.body_strength": review.bodyStrength,
    "review.carbonation_intensity": review.carbonationIntensity,
    "review.bitterness": review.bitterness,
    "review.acidity": review.acidity,
    "review.duration": review.duration,
    "review.price": review.price,
    "review.price_currency": review.priceCurrency,
    "review.purchase_type": review.purchaseType,
  });
};
