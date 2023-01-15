import type { ComparableArray, CompareFunc, RFC6902 } from "../types";
// @ts-ignore
import { diffUnknownValues } from "./diff-unknown-values";
import bestSubSequence from "fast-array-diff/dist/diff/lcs";

// @ts-ignore
import * as util from "util";

// @ts-ignore
const log = (v: unknown) => {
  // console.log(util.inspect(v, { depth: null }));
};

type RemoveOperationCandidate = {
  type: "remove";
  value: unknown;
  sourceArrayRemovalBatch: {
    startIdx: number;
    length: number;
    lengthShift: number;
  };
  sourceArrayRemovalBatchPosition: number;
  sourceArrayIdx: number;
  totalShiftedIdx: number;
};
type AddOperationCandidate = {
  type: "add";
  value: unknown;
  targetArrayIdx: number;
  sourceArrayAdditionBatch: {
    startIdx: number;
    length: number;
  };
  sourceArrayAdditionBatchPosition: number;
  sourceArrayIdx: number;
  totalShiftedIdx: number;
};

type OperationCandidate =
  | RemoveOperationCandidate
  | AddOperationCandidate
  | {
      type: "replace";
      value: unknown;
      removedValue: unknown;
      shiftedIdx: number;
    }
  | {
      type: "move";
      value: unknown;
      fromShiftedIdx: number;
      toShiftedIdx: number;
    };

type LCSChange = {
  type: "add" | "remove" | "same";
  oldStart: number;
  oldEnd: number;
  newStart: number;
  newEnd: number;
};

type IndexShifts = {
  additionsIdxShift: 0;
  removalsIdxShift: 0;
};

export function diffArraysUsingLcs(
  leftArr: ComparableArray,
  rightArr: ComparableArray,
  compareFunc: CompareFunc,
  path: string = "",
  operations: RFC6902.Operation[] = [],
  detectMoveOperations = false
): RFC6902.Operation[] {
  return getLcsBasedOperations(
    leftArr,
    rightArr,
    compareFunc,
    path,
    operations,
    detectMoveOperations
  );
}

function mapLcsChangesToOperationCandidates<T>(
  changes: LCSChange[],
  leftArr: T[],
  rightArr: T[],
  indexShifts: IndexShifts
) {
  const operationCandidates: OperationCandidate[] = [];

  for (const change of changes) {
    if (change.type === "remove") {
      const leftArrayItemsToRemove = leftArr.slice(
        change.oldStart,
        change.oldEnd
      );

      const sourceArrayRemovalBatch: RemoveOperationCandidate["sourceArrayRemovalBatch"] =
        {
          startIdx: change.oldStart,
          length: leftArrayItemsToRemove.length,
          lengthShift: 0,
        };

      for (const [i, leftArrItemToRemove] of leftArrayItemsToRemove.entries()) {
        const sourceArrayIdx = change.oldStart + i;
        const totalShiftedIdx =
          sourceArrayIdx +
          indexShifts.additionsIdxShift -
          indexShifts.removalsIdxShift +
          i;

        operationCandidates.push({
          type: "remove",
          value: leftArrItemToRemove,
          sourceArrayRemovalBatch,
          sourceArrayRemovalBatchPosition: i,
          sourceArrayIdx,
          totalShiftedIdx,
        });
        indexShifts.removalsIdxShift++;
      }
    } else if (change.type === "add") {
      const rightArrayItemsToAdd = rightArr.slice(
        change.newStart,
        change.newEnd
      );

      const sourceArrayAdditionBatch: AddOperationCandidate["sourceArrayAdditionBatch"] =
        {
          startIdx: change.oldStart,
          length: rightArrayItemsToAdd.length,
        };

      for (const [i, rightArrItemToAdd] of rightArrayItemsToAdd.entries()) {
        const targetArrayIdx = change.newStart + i;

        const sourceArrayIdx = change.oldStart + i;
        const totalShiftedIdx =
          sourceArrayIdx +
          indexShifts.additionsIdxShift -
          indexShifts.removalsIdxShift -
          i;

        operationCandidates.push({
          type: "add",
          value: rightArrItemToAdd,
          targetArrayIdx,
          sourceArrayAdditionBatch,
          sourceArrayAdditionBatchPosition: i,
          sourceArrayIdx,
          totalShiftedIdx,
        });
        indexShifts.additionsIdxShift++;
      }
    }
  }
  return operationCandidates;
}

function mapOperationCandidatesToOperations<T>(
  operationCandidates: OperationCandidate[],
  outputOperations: RFC6902.Operation[],
  path: string,
  compareFunc: CompareFunc,
  leftArr: T[],
  shouldDetectMoveOperations: boolean
) {
  for (const candidate of operationCandidates) {
    if (candidate.type === "remove") {
      const removalIdx =
        candidate.totalShiftedIdx -
        candidate.sourceArrayRemovalBatchPosition -
        candidate.sourceArrayRemovalBatch.lengthShift;

      outputOperations.push({
        op: "remove",
        path: `${path}/${removalIdx}`,
      });
    } else if (candidate.type === "add") {
      outputOperations.push({
        op: "add",
        path: `${path}/${candidate.totalShiftedIdx}`,
        value: candidate.value,
      });
    } else if (candidate.type === "move") {
      outputOperations.push({
        op: "move",
        path: `${path}/${candidate.toShiftedIdx}`,
        from: `${path}/${candidate.fromShiftedIdx}`,
      });
    } else if (candidate.type === "replace") {
      diffUnknownValues(
        leftArr[candidate.shiftedIdx],
        candidate.value,
        compareFunc,
        `${path}/${candidate.shiftedIdx}`,
        true,
        outputOperations,
        shouldDetectMoveOperations
      );
    }
  }
}

export function getLcsBasedOperations<T>(
  leftArr: T[],
  rightArr: T[],
  compareFunc: CompareFunc,
  path: string,
  outputOperations: RFC6902.Operation[] = [],
  shouldDetectMoveOperations = false
): RFC6902.Operation[] {
  let lcsLength = -1;

  const operationCandidates: OperationCandidate[] = [];

  const batchAdditionChanges: LCSChange[] = [];
  const batchRemovalChanges: LCSChange[] = [];

  const indexShifts: IndexShifts = {
    additionsIdxShift: 0,
    removalsIdxShift: 0,
  };

  function pushChange(
    type: "add" | "remove" | "same",
    _oldArr: T[],
    oldStart: number,
    oldEnd: number,
    _newArr: T[],
    newStart: number,
    newEnd: number
  ) {
    const change: LCSChange = Object.freeze({
      type,
      oldStart,
      oldEnd,
      newStart,
      newEnd,
    });

    if (type === "same") {
      // TODO lcsLength += oldEnd - oldStart
      lcsLength++;

      const batchOfChanges = [...batchRemovalChanges, ...batchAdditionChanges];

      if (batchOfChanges.length === 0) {
        return;
      }

      const batchOperationCandidates = mapLcsChangesToOperationCandidates(
        batchOfChanges,
        leftArr,
        rightArr,
        indexShifts
      );

      log({
        leftArr,
        rightArr,
        batchOfChanges,
        operationCandidates: batchOperationCandidates,
      });

      if (
        batchRemovalChanges.length !== 0 &&
        batchAdditionChanges.length !== 0
      ) {
        detectReplaceOperations(batchOperationCandidates);

        log({
          leftArr,
          rightArr,
          operationCandidatesWithReplaces: batchOperationCandidates,
        });
      }

      operationCandidates.push(...batchOperationCandidates);

      batchAdditionChanges.splice(0);
      batchRemovalChanges.splice(0);
    } else if (type === "add") {
      batchAdditionChanges.push(change);
    } else if (type === "remove") {
      batchRemovalChanges.push(change);
    }
  }

  bestSubSequence(leftArr, rightArr, compareFunc, pushChange);

  pushChange("same", [], 0, 0, [], 0, 0);

  if (lcsLength <= 0) {
    outputOperations.push({ op: "replace", path, value: rightArr });

    return outputOperations;
  }

  mapOperationCandidatesToOperations(
    operationCandidates,
    outputOperations,
    path,
    compareFunc,
    leftArr,
    shouldDetectMoveOperations
  );

  return outputOperations;
}

function detectReplaceOperations(candidates: OperationCandidate[]) {
  for (let i = candidates.length - 1; i >= 0; i--) {
    if (candidates[i].type !== "add" && candidates[i].type !== "remove") {
      continue;
    }

    for (let j = i - 1; j >= 0; j--) {
      if (candidates[j].type === candidates[i].type) {
        continue;
      }
      if (candidates[j].type !== "add" && candidates[j].type !== "remove") {
        continue;
      }

      const addOperationCandidate = (
        candidates[i].type === "add" ? candidates[i] : candidates[j]
      ) as AddOperationCandidate;

      const removeOperationCandidate = (
        candidates[i].type === "remove" ? candidates[i] : candidates[j]
      ) as RemoveOperationCandidate;

      const isValidReplaceMatch =
        addOperationCandidate.targetArrayIdx ===
        removeOperationCandidate.sourceArrayIdx;

      if (!isValidReplaceMatch) {
        continue;
      }

      removeOperationCandidate.sourceArrayRemovalBatch.lengthShift--;

      candidates[j] = {
        type: "replace",
        value: addOperationCandidate.value,
        removedValue: removeOperationCandidate.value,
        shiftedIdx: removeOperationCandidate.sourceArrayIdx,
      };

      candidates.splice(i, 1);

      break;
    }
  }
}
//
// function detectMoveOperations(
//   candidates: OperationCandidate[],
//   compareFunc: (ia: unknown, ib: unknown) => boolean
// ) {
//   for (let i = 0; i < candidates.length; i++) {
//     if (candidates[i].type !== "add" && candidates[i].type !== "remove") {
//       continue;
//     }
//
//     for (let j = candidates.length - 1; j > i; j--) {
//       if (candidates[j].type === candidates[i].type) {
//         continue;
//       }
//       if (candidates[j].type !== "add" && candidates[j].type !== "remove") {
//         continue;
//       }
//       if (!compareFunc(candidates[i].value, candidates[j].value)) {
//         continue;
//       }
//
//       const addOperationCandidate = (
//         candidates[i].type === "add" ? candidates[i] : candidates[j]
//       ) as AddOperationCandidate;
//
//       const removeOperationCandidate = (
//         candidates[i].type === "remove" ? candidates[i] : candidates[j]
//       ) as RemoveOperationCandidate;
//
//       const toIdxShift = 0;
//       const fromIdxShift =
//         removeOperationCandidate.idx > addOperationCandidate.idx ? -1 : 0;
//       // const toIdxShift =
//       //   addOperationCandidate.idx > removeOperationCandidate.idx ? +1 : 0;
//
//       candidates[i] = {
//         type: "move",
//         fromShiftedIdx: removeOperationCandidate.shiftedIdx + fromIdxShift,
//         toShiftedIdx: addOperationCandidate.shiftedIdx + toIdxShift,
//         value: addOperationCandidate.value,
//       };
//       candidates.splice(j, 1);
//     }
//   }
// }
//
