/**
 * > The source from which to get environment properties asynchronously.
 *
 * ## Examples of use
 *
 * ### Fallback sources
 *
 * Sometimes is needed to provide a fallback source if the first one fails. This can be done easily in the original
 * properties source with the `catch` method or the `catchError` operator function.
 * This condition can be chained as many times as necessary.
 *
 * ```ts
 * const fileSource = { load: () => fetch('environment.json').catch(() => fetch('environment2.json')) };
 * ```
 *
 * ### Sources for Long-lived Observables
 *
 * If the application needs to load the properties from sources that emit multiple times asynchronously,
 * such as a webservice or a Server Sent Event (SSE) service, ensure that `loadInOrder` is `false` or is the
 * last source, because ordered sources must complete to let the next one start.
 *
 * ```ts
 * const serverSideEventSource = {
 *   loadInOrder: false,
 *   load: () => sseFetch('/endpoint')
 * }
 * ```
 *
 * @module EnvironmentSource
 */
export * from './environment-source.gateway';
