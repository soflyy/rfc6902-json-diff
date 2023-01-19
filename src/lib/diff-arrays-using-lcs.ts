import type { ComparableArray, CompareFunc, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";
import bestSubSequence from "fast-array-diff/dist/diff/lcs";

type IndexShifts = {
  additionsIdxShift: 0;
  removalsIdxShift: 0;
};

type RemoveOperationCandidate = {
  type: "remove";
  value: unknown;
  targetArrayIdx: number;
  sourceArrayRemovalBatch: {
    startIdx: number;
    length: number;
    lengthShift: number;
  };
  sourceArrayRemovalBatchPosition: number;
  sourceArrayIdx: number;
  totalShiftedIdx: number;

  indexShifts: IndexShifts;
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

  indexShifts: IndexShifts;
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
        const targetArrayIdx = change.newStart + i;

        const sourceArrayIdx = change.oldStart + i;
        const totalShiftedIdx =
          sourceArrayIdx +
          indexShifts.additionsIdxShift -
          indexShifts.removalsIdxShift +
          i;

        operationCandidates.push({
          type: "remove",
          value: leftArrItemToRemove,
          targetArrayIdx,
          sourceArrayRemovalBatch,
          sourceArrayRemovalBatchPosition: i,
          sourceArrayIdx,
          totalShiftedIdx,
          indexShifts: { ...indexShifts },
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
          indexShifts: { ...indexShifts },
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

  // const batchOfChanges: LCSChange[] = [];
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
    const change: LCSChange = {
      type,
      oldStart,
      oldEnd,
      newStart,
      newEnd,
    };

    if (type === "same") {
      lcsLength += 1 + (change.oldEnd - change.oldStart);

      const batchOfChanges: LCSChange[] = [
        ...batchRemovalChanges,
        ...batchAdditionChanges,
      ];
      if (batchOfChanges.length === 0) {
        return;
      }

      const batchOperationCandidates = mapLcsChangesToOperationCandidates(
        batchOfChanges,
        leftArr,
        rightArr,
        indexShifts
      );

      detectReplaceOperations(batchOperationCandidates);

      operationCandidates.push(...batchOperationCandidates);

      batchAdditionChanges.splice(0);
      batchRemovalChanges.splice(0);
    } else if (type === "add") {
      batchAdditionChanges.push(change);
    } else if (type === "remove") {
      if (batchAdditionChanges.length > 0) {
        for (const addChange of batchAdditionChanges) {
          addChange.oldStart += change.oldEnd - change.oldStart;
        }

        change.newStart -= change.oldEnd - change.oldStart;
      }

      batchRemovalChanges.push(change);
    }
  }

  bestSubSequence(leftArr, rightArr, compareFunc, pushChange);

  pushChange("same", [], 0, 0, [], 0, 0);

  if (lcsLength <= 0) {
    outputOperations.push({ op: "replace", path, value: rightArr });

    return outputOperations;
  }

  if (shouldDetectMoveOperations) {
    detectMoveOperations(operationCandidates, compareFunc);
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

function detectMoveOperations(
  candidates: OperationCandidate[],
  compareFunc: CompareFunc
) {
  for (let i = candidates.length - 1; i >= 0; i--) {
    const candidateI = candidates[i];

    if (candidateI.type !== "add" && candidateI.type !== "remove") {
      continue;
    }

    const candidateITotalIndexShift =
      candidateI.indexShifts.additionsIdxShift -
      candidateI.indexShifts.removalsIdxShift;

    for (let j = i - 1; j >= 0; j--) {
      const candidateJ = candidates[j];

      if (candidateJ.type === candidateI.type) {
        continue;
      }
      if (candidateJ.type !== "add" && candidateJ.type !== "remove") {
        continue;
      }
      if (!compareFunc(candidateI.value, candidateJ.value)) {
        continue;
      }

      const addOperationCandidate = (
        candidateI.type === "add" ? candidateI : candidateJ
      ) as AddOperationCandidate;

      const removeOperationCandidate = (
        candidateI.type === "remove" ? candidateI : candidateJ
      ) as RemoveOperationCandidate;

      const candidateJTotalIndexShift =
        candidateJ.indexShifts.additionsIdxShift -
        candidateJ.indexShifts.removalsIdxShift;

      const fromIdxShift =
        candidateITotalIndexShift - candidateJTotalIndexShift;

      candidates[j] = {
        type: "move",
        fromShiftedIdx:
          removeOperationCandidate.totalShiftedIdx >
          addOperationCandidate.totalShiftedIdx
            ? removeOperationCandidate.totalShiftedIdx - fromIdxShift
            : removeOperationCandidate.totalShiftedIdx,
        toShiftedIdx: addOperationCandidate.totalShiftedIdx,
        value: addOperationCandidate.value,
      };
      candidates.splice(i, 1);

      break;
    }
  }
}
