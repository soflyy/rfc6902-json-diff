import type { ComparableValue, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";

export function compare(
  left: ComparableValue,
  right: ComparableValue
): RFC6902.Operation[] {
  return diffUnknownValues(left, right);
}
