import type { ComparableRecord, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";
import { appendToPath } from "./util";

export function diffObjects(
  leftObj: ComparableRecord,
  rightObj: ComparableRecord,
  path = ""
): RFC6902.Operation[] {
  const operations: RFC6902.Operation[] = [];

  const leftKeys = Object.keys(leftObj);
  const rightKeys = Object.keys(rightObj);

  for (let i = leftKeys.length - 1; i >= 0; i--) {
    const leftKey = leftKeys[i];

    const leftVal = leftObj[leftKey];
    const rightVal = rightObj[leftKey];

    operations.push(
      ...diffUnknownValues(
        leftVal,
        rightVal,
        appendToPath(path, leftKey),
        Object.prototype.hasOwnProperty.call(rightObj, leftKey)
      )
    );
  }

  for (let i = 0; i < rightKeys.length; i++) {
    const rightKey = rightKeys[i];

    if (
      !Object.prototype.hasOwnProperty.call(leftObj, rightKey) &&
      rightObj[rightKey] !== undefined
    ) {
      operations.push({
        op: "add",
        path: appendToPath(path, rightKey),
        value: rightObj[rightKey],
      });
    }
  }

  return operations;
}
