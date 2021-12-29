/**
 * > Stores the environment properties that the application needs.
 *
 * ## Use cases
 *
 * Below we present the implementation of this gateway with some state managers.
 * It is not intended to be an exhaustive list of integrations with all the functionalities,
 * but an example of how to use the current application's state manager.
 *
 * ### RxJS
 *
 * A basic RxJS implementation that uses a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) as state manager.
 *
 * ```js
 * import { BehaviorSubject } from 'rxjs';
 *
 * const initialState = {};
 * const store = new BehaviorSubject(initialState);
 * export const environmentStore = {
 *   getAll$: () => store.asObservable(),
 *   getAll: () => store.getValue(),
 *   update: (environment) => store.next(environment),
 *   reset: () => store.next(initialState),
 * };
 * ```
 *
 * ### Redux
 *
 * [Redux](https://redux.js.org/) is a predictable state container for JavaScript apps.
 *
 * ```js
 * import { createStore } from 'redux';
 * import { from } from 'rxjs';
 *
 * const initialState = {};
 * const reducer = (state = initialState, action) => {
 *   switch (action.type) {
 *     case 'UPDATE':
 *       return action.environment;
 *     case 'RESET':
 *       return initialState;
 *     default:
 *       return state;
 *   }
 * };
 * const store = createStore(reducer);
 * export const environmentStore = {
 *   getAll$: () => from(store),
 *   getAll: () => store.getState(),
 *   update: (environment) => store.dispatch({ type: 'UPDATE', environment }),
 *   reset: () => store.dispatch({ type: 'RESET' }),
 * };
 * ```
 *
 * ### Akita
 *
 * [Akita](https://datorama.github.io/akita/) is a state management pattern built on top of RxJS.
 *
 * ```js
 * import { createStore } from '@datorama/akita';
 *
 * const store = createStore({}, { name: 'environment', resettable: true });
 * export const environmentStore = {
 *   getAll$: () => store._select((state) => state),
 *   getAll: () => store.getValue(),
 *   update: (environment) => store._setState(environment),
 *   reset: () => store.reset(),
 * };
 * ```
 *
 * @module EnvironmentStore
 */
export * from './environment-store.gateway';
export * from './environment.type';
export * from './property.type';
