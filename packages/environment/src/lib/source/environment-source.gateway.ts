import { ObservableInput } from 'rxjs';

import { Path } from '../path';
import { EnvironmentState } from '../store';

/**
 * The source from which to get environment properties asynchronously.
 */
export abstract class EnvironmentSource {
  /**
   * The internal id.
   */
  id?: string;

  /**
   * The source name.
   *
   * @example
   * ```js
   * source.name = 'fileSource';
   * ```
   *
   * Set the name if you're planning to use a loader source lifecycle to add custom behavior to the source.
   * This way it will be easier to discriminate the source to decide whether or not the custom code is executed.
   * Avoid the use of `constructor.name` because if the code is minimized or uglified on build the constructor
   * name changes.
   *
   */
  name?: string;

  /**
   * Loads the required to load sources before the environment load.
   *
   * It's useful to delay the loading of the application until all the necessary properties from this sources
   * are available in the environment.
   * @example
   * ```js
   * const firstSource = {
   *   requiredToLoad: true,
   *   load: () => of({ a: 0 }).pipe(delay(10))
   * };
   * const secondSource = {
   *   requiredToLoad: true,
   *   load: () => of({ b: 0 }).pipe(delay(20))
   * };
   * loader.load(); // resolves after 20 ms
   * // sets the firstSource properties after 10 ms
   * // sets the secondSource properties after 20 ms
   * ```
   *
   * If there is no required to load sources the loader will resolve immedialely.
   * @example
   * ```js
   * const noRequiredSource = { load: () => of({ a: 0 }).pipe(delay(10)) };
   * loader.load(); // resolves immedialely
   * // sets the noRequiredSource properties after 10 ms
   * ```
   *
   * If a required to load source never completes the loader will never resolve.
   * @example
   * ```js
   * const infiniteSource = {
   *   requiredToLoad: true,
   *   load: () => interval(10).pipe(map(value => ({ value })))
   * };
   * loader.load(); // will never resolve
   * // sets the infiniteSource properties every 10 ms
   * ```
   *
   * The loader will reject after a required to load source error.
   * @example
   * ```js
   * const firstSource = {
   *   requiredToLoad: true,
   *   load: () => throwError(() => new Error())
   * };
   * const secondSource = {
   *   requiredToLoad: true,
   *   load: () => of({ b: 0 }).pipe(delay(20))
   * };
   * loader.load(); // rejects immedialely
   * // sets the secondSource properties after 20 ms
   * ```
   *
   * The loader will resolves normally after a no required to load source error.
   * @example
   * ```js
   * const firstSource = { load: () => throwError(() => new Error()) };
   * const secondSource = {
   *   requiredToLoad: true,
   *   load: () => of({ b: 0 }).pipe(delay(20))
   * };
   * loader.load(); // resolves after 20 ms
   * // sets the secondSource properties after 20 ms
   * ```
   */
  requiredToLoad?: boolean;

  /**
   * Loads the source in the declaration order.
   *
   * The not loadInOrder sources will add properties all at once.
   * @example
   * ```js
   * const firstSource = { load: () => of({ a: 0 }).pipe(delay(10)) };
   * const secondSource = { load: () => of({ b: 0 }).pipe(delay(10)) };
   * loader.load(); // resolves immediately
   * // sets the firstSource properties after 10 ms
   * // sets the secondSource properties after 10 ms
   * ```
   *
   * The loadInOrder sources will wait until the previous loadInOrder source completes to add the properties.
   * @example
   * ```js
   * const firstSource = {
   *   loadInOrder: true,
   *   load: () => of({ a: 0 }, { a: 1 }, { a: 2 }).pipe(delay(10))
   * };
   * const secondSource = {
   *   loadInOrder: true,
   *   load: () => of({ b: 0 }).pipe(delay(10))
   * };
   * loader.load(); // resolves immediately
   * // sets the firstSource properties after 10 ms, 20 ms & 30ms
   * // sets the secondSource properties after 40 ms
   * ```
   *
   * If a loadInOrder source never completes will never set the next ordered source properties.
   * @example
   * ```js
   * const infiniteSource = {
   *   loadInOrder: true,
   *   load: () => interval(10).pipe(map(a => ({ a })))
   * };
   * const secondSource = {
   *   loadInOrder: true,
   *   load: () => of({ b: 0 }).pipe(delay(10))
   * };
   * loader.load(); // resolves immediately
   * // sets the infiniteSource properties every 10 ms
   * // never sets the secondSource properties
   * ```
   *
   * If a loadInOrder source returns an error will be ignored and will continue with the next ordered source.
   * @example
   * ```js
   * const firstSource = {
   *   loadInOrder: true,
   *   load: () => throwError(() => new Error())
   * };
   * const secondSource = {
   *   loadInOrder: true,
   *   load: () => of({ b: 0 }).pipe(delay(10))
   * };
   * loader.load(); // resolves immediately
   * // sets the secondSource properties after 10 ms
   * ```
   */
  loadInOrder?: boolean;

  /**
   * Adds properties to the environment using the deep merge strategy.
   * @see {@link EnvironmentService}.merge
   */
  mergeProperties?: boolean;

  /**
   * Ignores the errors thrown by the source.
   *
   * If a required to load source throws an error the loader will rejects, but if the `ignoreError` property is set
   * to `true` the error will be ignored as a no required to load source error.
   * @example
   * ```js
   * const firstSource = {
   *   requiredToLoad: true,
   *   ignoreError: true,
   *   load: () => throwError(() => new Error())
   * };
   * const secondSource = {
   *   requiredToLoad: true,
   *   load: () => of({ b: 0 }).pipe(delay(20))
   * };
   * loader.load(); // resolves after 20 ms
   * // sets the secondSource properties after 20 ms
   * ```
   */
  ignoreError?: boolean;

  /**
   * The path to set the properties in the environment.
   * @see {@link Path}
   */
  path?: Path;

  /**
   * Asynchronously loads the environment properties from the source.
   *
   * The EnvironmentSource can returns a Promise.
   * @example
   * ```js
   * const promiseSource = { load: () => Promise.resolve({ a: 0 }) };
   * loader.load(); // resolves immediately
   * // sets the PromiseSource properties after 0 ms
   * ```
   *
   * The EnvironmentSource can returns an Observable or any other Subscribable type.
   * @example
   * ```js
   * const observableSource = { load: () =>  of({ a: 0 }) };
   * const multipleObservableSource = { load: () => of({ a: 0 }, { b: 0 }, { c: 0 }) };
   * loader.load(); // resolves immediately
   * // sets the observableSource properties after 0 ms
   * // sets the multipleObservableSource properties after 0 ms, 1 ms and 2 ms
   * ```
   *
   * The EnvironmentSource can returns an Array or any Iterable type.
   * @example
   * ```js
   * const arraySource = { load: () => ([{ a: 0 }]) };
   * const multipleArraySource = { load: () => ([{ a: 0 }, { b: 0 }, { c: 0 }]) }
   * loader.load(); // resolves immediately
   * // sets the arraySource properties after 0 ms
   * // sets the multipleArraySource properties after 0 ms, 1 ms and 2 ms
   * ```
   */
  abstract load(): ObservableInput<EnvironmentState>;
}
