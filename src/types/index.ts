export * from "./rfc6902";

export type ComparableRecord = Record<string | number, unknown>;
export type ComparableArray = Array<unknown>;
export type ComparableValue = ComparableRecord | ComparableArray;
