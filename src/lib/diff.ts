import type { ComparableRecord, ComparableValue, RFC6902 } from "../types";
import { cloneDeep } from "lodash";
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

  // Trivial Case: Both Arrays Are Empty
  if (leftLen === 0 && rightLen === 0) {
    return [];
  }

  // TODO trivial case leftLen === 0 (all adds)
  // TODO trivial case rightLen === 0 (all removes)

  if (leftLen === 1 && rightLen === 1) {
    return diffUnknownValues(leftArr[0], rightArr[0], joinPathWith(path, 0));
  }

  let commonHeadIdx = 0;
  let commonTailReverseIdx = 0;

  while (commonHeadIdx < leftLen && commonHeadIdx < rightLen) {
    const diffBetweenLeftAndRightHeadItemsAtIdx = diffUnknownValues(
      leftArr[commonHeadIdx],
      rightArr[commonHeadIdx],
      joinPathWith(path, commonHeadIdx)
    );

    if (diffBetweenLeftAndRightHeadItemsAtIdx.length) {
      // TODO use diffBetweenLeftAndRightHeadItem
      break;
    }

    commonHeadIdx++;
  }

  while (
    commonTailReverseIdx + commonHeadIdx < leftLen &&
    commonTailReverseIdx + commonHeadIdx < rightLen
  ) {
    const diffBetweenLeftAndRightTailItemsAtIdx = diffUnknownValues(
      leftArr[leftLen - 1 - commonTailReverseIdx],
      rightArr[rightLen - 1 - commonTailReverseIdx],
      joinPathWith(path, commonHeadIdx)
    );

    if (diffBetweenLeftAndRightTailItemsAtIdx.length) {
      // TODO use diffBetweenLeftAndRightTailItemsAtIdx
      break;
    }

    commonTailReverseIdx++;
  }

  if (commonHeadIdx + commonTailReverseIdx === leftLen) {
    if (leftLen === rightLen) {
      // Trivial Case: Arrays Are Identical
      return [];
    }

    // Trivial Case: a block (1 or more consecutive items) was added
    const operations: RFC6902.Operation[] = [];
    for (
      let index = commonHeadIdx;
      index < rightLen - commonTailReverseIdx;
      index++
    ) {
      operations.push({
        op: "add",
        path: joinPathWith(path, index),
        value: rightArr[index],
      });
    }

    return operations;
  } else if (commonHeadIdx + commonTailReverseIdx === rightLen) {
    // Trivial Case: a block (1 or more consecutive items) was removed
    const operations: RFC6902.Operation[] = [];
    for (
      let index = commonHeadIdx;
      index < leftLen - commonTailReverseIdx;
      index++
    ) {
      operations.push({
        op: "remove",
        path: joinPathWith(path, commonHeadIdx),
      });
    }
    return operations;
  } else {
    // Complex Case – LCS computation is necessary
    return diffArraysUsingLcs(leftArr, rightArr, path);
  }
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
        value: cloneDeep(rightVal),
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
        value: cloneDeep(rightVal),
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
        leftKey in rightObj
      )
    );
  }

  for (let i = 0; i < rightKeys.length; i++) {
    const key = rightKeys[i];
    if (!leftObj.hasOwnProperty(key) && rightObj[key] !== undefined) {
      operations.push({
        op: "add",
        path: joinPathWith(path, key),
        value: cloneDeep(rightObj[key]),
      });
    }
  }

  return operations;
}
