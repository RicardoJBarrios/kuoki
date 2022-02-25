/**
 * A property name, a dot-separated set of property names or an array of property names
 * that represents a path to get an environment value.
 *
 * An environment property name must be a sequence of ASCII characters that can contain letters `a-zA-Z`,
 * `$`, `_`, and digits `0-9`, but may not start with a digit.
 * @see {@link isPath}
 */
export type Path = string | string[];
