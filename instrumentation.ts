export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerOTel } = await import("@vercel/otel");
    const { PrismaInstrumentation } = await import("@prisma/instrumentation");

    const instrumentations = [new PrismaInstrumentation()];

    if (process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET) {
      const { OTLPTraceExporter } = await import(
        "@opentelemetry/exporter-trace-otlp-http"
      );

      registerOTel({
        serviceName: "zythogora",
        traceExporter: new OTLPTraceExporter({
          url: "https://api.axiom.co/v1/traces",
          headers: {
            Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
            "X-Axiom-Dataset": process.env.AXIOM_DATASET,
          },
        }),
        instrumentations,
      });
    } else {
      const { ConsoleSpanExporter } = await import(
        "@opentelemetry/sdk-trace-base"
      );

      registerOTel({
        serviceName: "zythogora",
        traceExporter: new ConsoleSpanExporter(),
        instrumentations,
      });
    }
  }
}
