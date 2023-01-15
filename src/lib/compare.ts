import type {
  ComparableValue,
  CompareFunc,
  CompareOptions,
  RFC6902,
} from "../types";
import { diffUnknownValues } from "./diff-unknown-values";
import equal from "fast-deep-equal";

function createCompareFunc(doCaching: boolean): CompareFunc {
  if (!doCaching) {
    return equal;
  }

  const equalityCache = new WeakMap<object, unknown[]>();

  return (left, right) => {
    if (
      typeof left === "object" &&
      left !== null &&
      typeof right === "object" &&
      right !== null
    ) {
      if (equalityCache.has(left) && equalityCache.get(left)?.includes(right)) {
        return true;
      }

      if (
        equalityCache.has(right) &&
        equalityCache.get(right)?.includes(left)
      ) {
        return true;
      }

      const areEqual = equal(left, right);

      if (areEqual) {
        if (equalityCache.has(left)) {
          equalityCache.get(left)?.push(right);
        } else {
          equalityCache.set(left, [right]);
        }

        if (equalityCache.has(right)) {
          equalityCache.get(right)?.push(left);
        } else {
          equalityCache.set(right, [left]);
        }
      }

      return areEqual;
    } else {
      return equal(left, right);
    }
  };
}

export function compare(
  left: ComparableValue,
  right: ComparableValue,
  options: CompareOptions = {}
): RFC6902.Operation[] {
  const compareFunc = createCompareFunc(Boolean(options.doCaching));

  return diffUnknownValues(
    left,
    right,
    compareFunc,
    "",
    false,
    [],
    Boolean(options.detectMoveOperations)
  );
}
