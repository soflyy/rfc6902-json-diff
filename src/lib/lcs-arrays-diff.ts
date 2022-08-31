import type { ComparableArray, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff";
import { joinPathWith } from "./util";
import bestSubSequence from "fast-array-diff/dist/diff/lcs";
import equal from "fast-deep-equal";

export type PatchItem<T> = {
  type: "add" | "remove";
  oldPos: number;
  newPos: number;
  items: T[];
};

export type GetPatchOutput<T> = Array<PatchItem<T> | RFC6902.Operation<T>>;

export function getPatch<T>(
  a: T[],
  b: T[],
  compareFunc: (ia: T, ib: T) => boolean = (ia: T, ib: T) => ia === ib,
  path: string
): GetPatchOutput<T> {
  const patch: GetPatchOutput<T> = [];

  let lastAdd: PatchItem<T> | null = null;
  let lastRemove: PatchItem<T> | null = null;
  let replaces: RFC6902.Operation[] = [];

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
      if (lastRemove && lastRemove.items.length) {
        patch.push(lastRemove);
      }
      if (lastAdd && lastAdd.items.length) {
        patch.push(lastAdd);
      }
      if (replaces && replaces.length) {
        patch.push(...replaces);
      }
      lastRemove = null;
      lastAdd = null;
      replaces = [];
    } else if (type === "remove") {
      const startIdx = oldStart - removeIdxShift + addIdxShift;

      if (!lastRemove) {
        lastRemove = {
          type: "remove",
          oldPos: startIdx,
          newPos: newStart,
          items: [],
        };
      }

      if (lastAdd) {
        for (let i = oldStart, rIdx = 0; i < oldEnd; ++i, rIdx++) {
          const item = lastAdd.items.shift();
          if (item) {
            addIdxShift--;

            const oldValue = oldArr[i];
            const newValue = item;

            const deepReplacesPathPrefix = String(oldStart + rIdx);
            const deepReplaces = diffUnknownValues(
              oldValue,
              newValue,
              deepReplacesPathPrefix
            );

            replaces.push(
              ...deepReplaces.map((deepReplaceOperation) => ({
                ...deepReplaceOperation,
              }))
            );

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

      if (!lastAdd) {
        lastAdd = {
          type: "add",
          oldPos: startIdx,
          newPos: newStart,
          items: [],
        };
      }

      if (lastRemove) {
        for (let i = newStart, rIdx = 0; i < newEnd; ++i, rIdx++) {
          const item = lastRemove.items.shift();
          if (item) {
            removeIdxShift--;

            const oldValue = item;
            const newValue = newArr[i];

            const deepReplacesPathPrefix = String(startIdx + rIdx);
            const deepReplaces = diffUnknownValues(
              oldValue,
              newValue,
              deepReplacesPathPrefix
            );

            replaces.push(
              ...deepReplaces.map((deepReplaceOperation) => ({
                ...deepReplaceOperation,
              }))
            );

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

  return patch;
}

export function diffArraysUsingLcs(
  leftArr: ComparableArray,
  rightArr: ComparableArray,
  path: string = ""
): RFC6902.Operation[] {
  const lcsBasedPatch = getPatch(leftArr, rightArr, equal, path);

  const lcsBasedOperations: RFC6902.Operation[] = [];

  for (const lcsPatchItem of lcsBasedPatch) {
    if ("type" in lcsPatchItem && lcsPatchItem.type === "add") {
      lcsBasedOperations.push(
        ...lcsPatchItem.items.map(
          (lcsPatchItemValue, lcsPatchItemIdx): RFC6902.Operation => ({
            op: "add",
            value: lcsPatchItemValue,
            path: joinPathWith(path, lcsPatchItem.oldPos + lcsPatchItemIdx),
          })
        )
      );
    } else if ("type" in lcsPatchItem && lcsPatchItem.type === "remove") {
      lcsBasedOperations.push(
        ...lcsPatchItem.items.map(
          (_lcsPatchItemValue): RFC6902.Operation => ({
            op: "remove",
            path: joinPathWith(path, lcsPatchItem.oldPos),
          })
        )
      );
    } else if ("op" in lcsPatchItem) {
      lcsBasedOperations.push({
        ...lcsPatchItem,
        path: joinPathWith(path, lcsPatchItem.path),
      });
    }
  }
  return lcsBasedOperations;
}
