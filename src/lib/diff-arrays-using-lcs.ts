import type { ComparableArray, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";
import bestSubSequence from "fast-array-diff/dist/diff/lcs";
import equal from "fast-deep-equal";

type PatchItem<T> = {
  type: "add" | "remove";
  oldPos: number;
  newPos: number;
  items: T[];
};

export function diffArraysUsingLcs(
  leftArr: ComparableArray,
  rightArr: ComparableArray,
  path: string = "",
  operations: RFC6902.Operation[] = [],
  detectMoveOperations = false
): RFC6902.Operation[] {
  return getLcsBasedOperations(
    leftArr,
    rightArr,
    equal,
    path,
    operations,
    detectMoveOperations
  );
}

export function getLcsBasedOperations<T>(
  a: T[],
  b: T[],
  compareFunc: (ia: T, ib: T) => boolean = (ia: T, ib: T) => ia === ib,
  path: string,
  outputOperations: RFC6902.Operation[] = [],
  detectMoveOperations = false
): RFC6902.Operation[] {
  detectMoveOperations;
  let lastAdd: PatchItem<T> | null = null;
  let lastRemove: PatchItem<T> | null = null;
  let replaceAndDeepReplaceOperations: RFC6902.Operation[] = [];

  let addIdxShift = 0;
  let removeIdxShift = 0;

  let lcsLength = -1;

  const operations: RFC6902.Operation[] = [];

  function pushChange(
    type: "add" | "remove" | "same",
    oldArr: T[],
    oldStart: number,
    oldEnd: number,
    newArr: T[],
    newStart: number,
    newEnd: number
  ) {
    const startIdx = oldStart - removeIdxShift + addIdxShift;

    if (type === "same") {
      lcsLength++;
      if (lastRemove !== null) {
        for (let i = 0; i < lastRemove.items.length; i++) {
          operations.push({
            op: "remove",
            path: `${path}/${lastRemove.oldPos}`,
          });
        }
        lastRemove = null;
      }
      if (lastAdd !== null) {
        for (let i = 0; i < lastAdd.items.length; i++) {
          operations.push({
            op: "add",
            value: lastAdd.items[i],
            path: `${path}/${lastAdd.oldPos + i}`,
          });
        }
        lastAdd = null;
      }
      if (replaceAndDeepReplaceOperations.length > 0) {
        operations.push(...replaceAndDeepReplaceOperations);
        replaceAndDeepReplaceOperations = [];
      }
    } else if (type === "remove") {
      if (lastRemove === null) {
        lastRemove = {
          type: "remove",
          oldPos: startIdx,
          newPos: newStart,
          items: [],
        };
      }

      if (lastAdd !== null) {
        lastAdd.oldPos += oldEnd - oldStart;
        if (lastRemove.oldPos === oldStart) {
          lastRemove.newPos -= oldEnd - oldStart;
        }

        for (
          let oldStartI = oldStart, rIdx = 0;
          oldStartI < oldEnd;
          ++oldStartI, rIdx++
        ) {
          const item = lastAdd.items.shift();
          if (item) {
            addIdxShift--;

            const oldValue = oldArr[oldStartI];
            const newValue = item;

            const deepReplaces = diffUnknownValues(
              oldValue,
              newValue,
              `${path}/${oldStart + rIdx}`
            );

            replaceAndDeepReplaceOperations.push(...deepReplaces);
          } else {
            lastRemove.items.push(oldArr[oldStartI]);
            removeIdxShift++;
          }
        }
      } else {
        for (let i = oldStart; i < oldEnd; ++i) {
          lastRemove.items.push(oldArr[i]);
          removeIdxShift++;
        }
      }
    } else if (type === "add") {
      if (lastAdd === null) {
        lastAdd = {
          type: "add",
          oldPos: startIdx,
          newPos: newStart,
          items: [],
        };
      }

      if (lastRemove !== null) {
        for (let i = newStart, rIdx = 0; i < newEnd; ++i, rIdx++) {
          const item = lastRemove.items.shift();
          if (item) {
            removeIdxShift--;

            const oldValue = item;
            const newValue = newArr[i];

            const deepReplaces = diffUnknownValues(
              oldValue,
              newValue,
              `${path}/${startIdx + rIdx}`
            );

            replaceAndDeepReplaceOperations.push(...deepReplaces);

            lastAdd.oldPos++;
          } else {
            lastAdd.items.push(newArr[i]);
            addIdxShift++;
          }
        }
      } else {
        for (let i = newStart; i < newEnd; ++i) {
          lastAdd.items.push(newArr[i]);
          addIdxShift++;
        }
      }
    }
  }

  bestSubSequence(a, b, compareFunc, pushChange);

  pushChange("same", [], 0, 0, [], 0, 0);

  if (lcsLength > 0) {
    outputOperations.push(...operations);
  } else {
    outputOperations.push({ op: "replace", path, value: b });
  }

  return outputOperations;
}
