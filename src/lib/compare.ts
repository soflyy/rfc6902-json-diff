import type { ComparableValue, CompareOptions, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";

export function compare(
  left: ComparableValue,
  right: ComparableValue,
  options: CompareOptions = {}
): RFC6902.Operation[] {
  return diffUnknownValues(
    left,
    right,
    "",
    false,
    [],
    Boolean(options.detectMoveOperations)
  );
}
