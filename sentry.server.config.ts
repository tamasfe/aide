/**
 *
 * Attention! (note left by @ivan)
 *
 * As of 2025-01-01, the Sentry server-side tracing is currently still in beta,
 * all of a sudden we started having runtime errors "ReferenceError: require is not defined in ES module scope, you can use import instead"
 * And the only way to fix this without downgrading the package version too much was to deactivate Sentry server-side.
 *
 * (I tried deactivating traces only to keep the error reporting, but the same reference error stayed)
 *
 * My recommended approach would be waiting until Sentry gets their shit togheter and go out of beta,
 * or at least wait until right before our launch and see the state they are in.
 *
 * The commented code left here was working error-capturing-wise as well as sending traces to Sentry before the error started showing up.
 * But the OTEL config to send the traces to our Grafana was not still working. By the time we un-comment it, config will have probably changed.
 *
 */

// import * as Sentry from "@sentry/nuxt";
// import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
// import { SimpleSpanProcessor, ConsoleSpanExporter, BatchSpanProcessor, type SpanProcessor } from "@opentelemetry/sdk-trace-base";
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
// import {
//   SentrySpanProcessor,
//   SentryPropagator,
//   SentrySampler,
// } from "@sentry/opentelemetry";
// import { Resource } from "@opentelemetry/resources";

// /**
//  *
//  * More information about this file & Sentry with Nuxt @https://docs.sentry.io/platforms/javascript/guides/nuxt/
//  *
//  * The runtime configuration is not available at this stage, it has to be shared through env variables. More info @https://docs.sentry.io/platforms/javascript/guides/nuxt/#server-side-setup
//  *
//  */
// const sentryClient = Sentry.init({
//   dsn: "https://9d48502feda3a5b89674c4ad50c71b83@o4508212543684608.ingest.us.sentry.io/4508212545454080",

//   // We recommend adjusting this value in production, or using tracesSampler for finer control
//   tracesSampleRate: 1.0,
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["localhost", /^https:\/\/.*\.?girobet\.vip/],

//   environment: process.env.NODE_ENV === "production" ? "production" : "development",

//   release: process.env.NUXT_PUBLIC_RELEASE || "development",

//   // More information @https://docs.sentry.io/platforms/javascript/guides/nuxt/opentelemetry/custom-setup/
//   skipOpenTelemetrySetup: true,
//   registerEsmLoaderHooks: true,
// });
// if (!sentryClient) {
//   throw new Error("Sentry initialization failed");
// }

// const spanProcessors: SpanProcessor[] = [new SentrySpanProcessor()];
// if (process.env.NODE_ENV === "production") {
//   const exporter = new OTLPTraceExporter({
//     url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
//     concurrencyLimit: process.env.OTEL_BSP_MAX_CONCURRENT_EXPORTS ? Number(process.env.OTEL_BSP_MAX_CONCURRENT_EXPORTS) : undefined,
//   });
//   spanProcessors.push(new BatchSpanProcessor(exporter, {
//     scheduledDelayMillis: process.env.OTEL_BSP_SCHEDULE_DELAY ? Number(process.env.OTEL_BSP_SCHEDULE_DELAY) : undefined,
//     maxQueueSize: process.env.OTEL_BSP_MAX_QUEUE_SIZE ? Number(process.env.OTEL_BSP_MAX_QUEUE_SIZE) : undefined,
//     maxExportBatchSize: process.env.OTEL_BSP_MAX_EXPORT_BATCH_SIZE ? Number(process.env.OTEL_BSP_MAX_EXPORT_BATCH_SIZE) : undefined,
//     exportTimeoutMillis: process.env.OTEL_BSP_EXPORT_TIMEOUT ? Number(process.env.OTEL_BSP_EXPORT_TIMEOUT) : undefined,
//   }));
// }
// else {
//   const exporter = new ConsoleSpanExporter();
//   spanProcessors.push(new SimpleSpanProcessor(exporter));
// }

// // Note: This could be BasicTracerProvider, or any other provider depending on how you are using the OpenTelemetry SDK
// const provider = new NodeTracerProvider({
//   // Ensure the correct subset of traces is sent to Sentry, This also ensures trace propagation works as expected
//   sampler: sentryClient ? new SentrySampler(sentryClient) : undefined,
//   spanProcessors,
//   resource: new Resource({
//     "service.name": "girobet-frontend",
//   }),
// });

// provider.register({
//   // Ensure trace propagation works, this relies on the SentrySampler for correct propagation
//   propagator: new SentryPropagator(),
//   // Ensure context & request isolation are correctly managed
//   contextManager: new Sentry.SentryContextManager(),
// });

// // Validate that the setup is correct
// Sentry.validateOpenTelemetrySetup();

// console.log("Sentry OpenTelemetry setup complete to: ", process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
