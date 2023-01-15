import { diffObjects } from "./diff-objects";
import { diffArrays } from "./diff-arrays";
import type { RFC6902, CompareFunc } from "../types";

export function diffUnknownValues(
  leftVal: unknown,
  rightVal: unknown,
  compareFunc: CompareFunc,
  path = "",
  rightValExists = false,
  operations: RFC6902.Operation[] = [],
  detectMoveOperations = false
): RFC6902.Operation[] {
  if (Object.is(leftVal, rightVal)) {
    return operations;
  }

  if (!rightValExists && leftVal !== undefined && rightVal === undefined) {
    operations.push({
      op: "remove",
      path,
    });
    return operations;
  }

  const leftValType = leftVal === null ? "null" : typeof leftVal;
  const rightValType = rightVal === null ? "null" : typeof rightVal;

  const leftValIsArray = leftValType === "object" && Array.isArray(leftVal);
  const rightValIsArray = rightValType === "object" && Array.isArray(rightVal);

  if (leftValType !== rightValType || leftValIsArray !== rightValIsArray) {
    operations.push({
      op: "replace",
      path,
      value: rightVal,
    });
    return operations;
  }

  // Now that both values have the exact same type

  if (leftValIsArray && rightValIsArray) {
    diffArrays(
      leftVal,
      rightVal,
      compareFunc,
      path,
      operations,
      detectMoveOperations
    );
    return operations;
  } else if (leftValType === "object") {
    diffObjects(
      leftVal as Record<number, unknown>,
      rightVal as Record<number, unknown>,
      compareFunc,
      path,
      operations
    );
    return operations;
  } else {
    operations.push({
      op: "replace",
      path,
      value: rightVal,
    });
    return operations;
  }
}
