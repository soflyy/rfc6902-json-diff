export * as RFC6902 from "./rfc6902";

export type ComparableRecord = Record<string | number, unknown>;
export type ComparableArray = Array<unknown>;
export type ComparableValue = ComparableRecord | ComparableArray;
export type CompareOptions = {
  detectMoveOperations?: boolean;
  doCaching?: boolean;
};
export type CompareFunc = (ia: unknown, ib: unknown) => boolean;
