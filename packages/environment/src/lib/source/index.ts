/**
 * > The source from which to get environment properties asynchronously.
 *
 * A source is a definition to get a certain number of environment variables synchronously or asynchronously.
 * How these sources are resolved or how they add the properties to the environment can be defined by properties,
 * and an application can load one or as many sources as needed. More information in the class documentation.
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
 * const fileSource = {
 *   load: () => fetch('environment.json').catch(() => fetch('environment2.json'))
 * };
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
 * };
 * ```
 *
 * @module EnvironmentSource
 */
export * from './environment-source.gateway';
