import type { ComparableRecord, ComparableValue, RFC6902 } from "../types";
import { diffArraysUsingLcs } from "./lcs-arrays-diff";
import { joinPathWith } from "./util";

export function compare(
  left: ComparableValue,
  right: ComparableValue
): RFC6902.Operation[] {
  return diffUnknownValues(left, right);
}

export function diffArrays(
  leftArr: Array<unknown>,
  rightArr: Array<unknown>,
  path: string = ""
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
    return diffUnknownValues(leftArr[0], rightArr[0], joinPathWith(path, 0));
  }

  return diffArraysUsingLcs(leftArr, rightArr, path);
}

export function diffUnknownValues(
  leftVal: unknown,
  rightVal: unknown,
  path: string = "",
  rightValExists: boolean = false
): RFC6902.Operation[] {
  // TODO path-based memoization

  if (leftVal === rightVal) {
    return [];
  }

  if (!rightValExists && leftVal !== undefined && rightVal === undefined) {
    return [
      {
        op: "remove",
        path,
      },
    ];
  }

  const leftValType = leftVal === null ? "null" : typeof leftVal;
  const rightValType = rightVal === null ? "null" : typeof rightVal;

  const leftValIsArray = Array.isArray(leftVal);
  const rightValIsArray = Array.isArray(rightVal);

  if (leftValType !== rightValType || leftValIsArray !== rightValIsArray) {
    return [
      {
        op: "replace",
        path,
        value: rightVal,
      },
    ];
  }

  // Now that both values have the exact same type

  if (leftValIsArray && rightValIsArray) {
    return diffArrays(leftVal, rightVal, path);
  } else if (leftValType === "object") {
    return diffObjects(
      leftVal as Record<number, unknown>,
      rightVal as Record<number, unknown>,
      path
    );
  } else {
    return [
      {
        op: "replace",
        path,
        value: rightVal,
      },
    ];
  }
}

export function diffObjects(
  leftObj: ComparableRecord,
  rightObj: ComparableRecord,
  path: string = ""
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
        joinPathWith(path, leftKey),
        rightObj.hasOwnProperty(leftKey)
      )
    );
  }

  for (let i = 0; i < rightKeys.length; i++) {
    const rightKey = rightKeys[i];

    if (!leftObj.hasOwnProperty(rightKey) && rightObj[rightKey] !== undefined) {
      operations.push({
        op: "add",
        path: joinPathWith(path, rightKey),
        value: rightObj[rightKey],
      });
    }
  }

  return operations;
}
