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
  operations: RFC6902.Operation[] = []
): RFC6902.Operation[] {
  return getLcsBasedOperations(leftArr, rightArr, equal, path, operations);
}

export function getLcsBasedOperations<T>(
  a: T[],
  b: T[],
  compareFunc: (ia: T, ib: T) => boolean = (ia: T, ib: T) => ia === ib,
  path: string,
  outputOperations: RFC6902.Operation[] = []
): RFC6902.Operation[] {
  let lastAdd: PatchItem<T> | null = null;
  let lastRemove: PatchItem<T> | null = null;
  let replaceAndDeepReplaceOperations: RFC6902.Operation[] = [];

  let addIdxShift = 0;
  let removeIdxShift = 0;

  function pushChange(
    type: "add" | "remove" | "same",
    oldArr: T[],
    oldStart: number,
    oldEnd: number,
    newArr: T[],
    newStart: number,
    newEnd: number
  ) {
    if (type === "same") {
      if (lastRemove !== null) {
        for (let i = 0; i < lastRemove.items.length; i++) {
          outputOperations.push({
            op: "remove",
            path: `${path}/${lastRemove.oldPos}`,
          });
        }
      }
      if (lastAdd !== null) {
        for (let i = 0; i < lastAdd.items.length; i++) {
          outputOperations.push({
            op: "add",
            value: lastAdd.items[i],
            path: `${path}/${lastAdd.oldPos + i}`,
          });
        }
      }
      if (replaceAndDeepReplaceOperations !== null) {
        outputOperations.push(...replaceAndDeepReplaceOperations);
      }
      lastRemove = null;
      lastAdd = null;
      replaceAndDeepReplaceOperations = [];
    } else if (type === "remove") {
      const startIdx = oldStart - removeIdxShift + addIdxShift;

      if (lastRemove === null) {
        lastRemove = {
          type: "remove",
          oldPos: startIdx,
          newPos: newStart,
          items: [],
        };
      }

      if (lastAdd !== null) {
        for (let i = oldStart, rIdx = 0; i < oldEnd; ++i, rIdx++) {
          const item = lastAdd.items.shift();
          if (item) {
            addIdxShift--;

            const oldValue = oldArr[i];
            const newValue = item;

            const deepReplaces = diffUnknownValues(
              oldValue,
              newValue,
              `${path}/${oldStart + rIdx}`
            );

            replaceAndDeepReplaceOperations.push(...deepReplaces);

            lastRemove.oldPos++;
          } else {
            lastRemove.items.push(oldArr[i]);
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
      const startIdx = oldStart - removeIdxShift + addIdxShift;

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

  return outputOperations;
}
