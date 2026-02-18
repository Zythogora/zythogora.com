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
