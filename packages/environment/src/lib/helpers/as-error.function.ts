import { asString } from './as-string.function';

/**
 * Converts any type of error source into an Error.
 * @param error the error source.
 * @returns An error with the error source as message.
 */
export function asError<E>(error: E): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(asString(error));
}
