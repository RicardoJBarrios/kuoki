/**
 * An EnvironmentStore property value type.
 */
export type Property = string | number | boolean | null | undefined | Property[] | { [x: string]: Property };
