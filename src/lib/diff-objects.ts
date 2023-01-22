import type { ComparableRecord, RFC6902, CompareFunc } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";

export function diffObjects(
  leftObj: ComparableRecord,
  rightObj: ComparableRecord,
  compareFunc: CompareFunc,
  path = "",
  operations: RFC6902.Operation[] = []
): void {
  let key;

  for (key in leftObj) {
    diffUnknownValues(
      leftObj[key],
      rightObj[key],
      compareFunc,
      `${path}/${key}`,
      key in rightObj,
      operations
    );
  }

  for (key in rightObj) {
    if (!(key in leftObj) && rightObj[key] !== undefined) {
      operations.push({
        op: "add",
        path: `${path}/${key}`,
        value: rightObj[key],
      });
    }
  }
}
