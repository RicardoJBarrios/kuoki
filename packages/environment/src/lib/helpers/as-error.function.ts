import { asString } from './as-string.function';

/**
 * Converts any type of error source into an Error.
 * @template E The type of the error.
 * @param error the error source.
 * @returns An error with the error source as message.
 */
export function asError<E>(error: E): Error {
  if (error instanceof Error) {
    return error;
  }

  const message: string = asString(error);

  return new Error(message);
}
