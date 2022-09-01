import { appendToPath } from "./util";
import { diffArraysUsingLcs } from "./diff-arrays-using-lcs";
import { diffUnknownValues } from "./diff-unknown-values";
import type { RFC6902 } from "../types";

export function diffArrays(
  leftArr: Array<unknown>,
  rightArr: Array<unknown>,
  path = ""
): RFC6902.Operation[] {
  const leftLen = leftArr.length;
  const rightLen = rightArr.length;

  if (leftLen === 0 && rightLen === 0) {
    return [];
  }

  if (leftLen === 0) {
    return [{ op: "add", path, value: rightArr }];
  }

  if (rightLen === 0) {
    return [{ op: "replace", path, value: leftArr }];
  }

  if (leftLen === 1 && rightLen === 1) {
    return diffUnknownValues(leftArr[0], rightArr[0], appendToPath(path, 0));
  }

  return diffArraysUsingLcs(leftArr, rightArr, path);
}
