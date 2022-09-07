import { diffArraysUsingLcs } from "./diff-arrays-using-lcs";
import { diffUnknownValues } from "./diff-unknown-values";
import type { RFC6902 } from "../types";

export function diffArrays(
  leftArr: Array<unknown>,
  rightArr: Array<unknown>,
  path = "",
  operations: RFC6902.Operation[] = []
): RFC6902.Operation[] {
  const leftLen = leftArr.length;
  const rightLen = rightArr.length;

  if (leftLen === 0 && rightLen === 0) {
    return operations;
  }

  if (leftLen === 0) {
    operations.push({ op: "add", path, value: rightArr });
    return operations;
  }

  if (rightLen === 0) {
    operations.push({ op: "replace", path, value: leftArr });
    return operations;
  }

  if (leftLen === 1 && rightLen === 1) {
    return diffUnknownValues(
      leftArr[0],
      rightArr[0],
      `${path}/0`,
      true,
      operations
    );
  }

  return diffArraysUsingLcs(leftArr, rightArr, path, operations);
}
