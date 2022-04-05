import { LoaderSource } from '../loader-source';
import { EnvironmentState } from '../store';

/**
 * Loads the environment properties from the provided asynchronous sources.
 */
export abstract class EnvironmentLoader {
  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @returns A promise once the required sources are loaded.
   */
  abstract load(): Promise<void>;

  /**
   * Middleware function that gives the possibility to modify the source properties before inserting it into the environment.
   * @param properties The source properties.
   * @param source The environment properties source.
   * @returns The modified source properties.
   */
  abstract preAddProperties(properties: EnvironmentState, source?: LoaderSource): EnvironmentState;

  /**
   * Returns the loader source definition with the given id.
   * @param id The id of the loader source to get.
   * @returns The loader source definition or undefined if the source doesn't exist.
   */
  abstract getSourceById(id: string): LoaderSource | undefined;

  /**
   * Forces the load to resolve.
   */
  abstract resolveLoad(): void;

  /**
   * Forces the load to reject.
   * @template E The type of the error.
   * @param error The error to throw.
   */
  abstract rejectLoad<E>(error: E): void;

  /**
   * Forces the load to resolve and stops all ongoing source loads.
   */
  abstract completeAllSources(): void;

  /**
   * Completes a source load.
   * @param source The source to complete.
   */
  abstract completeSource(source: LoaderSource): void;

  /**
   * Forces the load to resolve, stops all ongoing source loads and completes the subjects.
   */
  abstract onDestroy(): void;
}
