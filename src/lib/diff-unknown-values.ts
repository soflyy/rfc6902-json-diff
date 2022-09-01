import { diffObjects } from "./diff-objects";
import { diffArrays } from "./diff-arrays";
import type { RFC6902 } from "../types";

export function diffUnknownValues(
  leftVal: unknown,
  rightVal: unknown,
  path = "",
  rightValExists = false
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
