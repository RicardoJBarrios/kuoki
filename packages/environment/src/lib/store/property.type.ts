/**
 * An environment property value.
 */
export type Property = string | number | boolean | null | undefined | Property[] | { [x: string]: Property };
