import type { ComparableArray, CompareFunc, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";
import { calcPatch } from "./util/fast-myers-diff";
import type {
  AddOperationCandidate,
  OperationCandidate,
  RemoveOperationCandidate,
} from "../types/lcs";

export function diffArraysUsingLcs(
  leftArr: ComparableArray,
  rightArr: ComparableArray,
  compareFunc: CompareFunc,
  path: string = "",
  operations: RFC6902.Operation[] = [],
  shouldDetectMoveOperations = false
): void {
  const operationCandidates: OperationCandidate[] = [];

  const fastMyersDiffIterator = calcPatch(leftArr, rightArr, (l, r) =>
    compareFunc(leftArr[l], rightArr[r])
  );

  let totalRemovalsCount = 0;
  let totalAdditionsCount = 0;

  let lcsLength = 0;
  let lcsI = 0;

  for (const diffEntry of fastMyersDiffIterator) {
    let [deleteStart, deleteEnd] = diffEntry;
    const [, , insert] = diffEntry;

    const sourceArrayRemovalBatchStartIdx = deleteStart;

    deleteStart += totalAdditionsCount - totalRemovalsCount;
    deleteEnd += totalAdditionsCount - totalRemovalsCount;

    if (lcsI !== deleteStart) {
      lcsLength += deleteStart - lcsI;
    }
    lcsI = deleteEnd;

    let batchAdditionsCount = 0;
    let batchRemovalsCount = 0;

    let insertIdxShift = 0;
    for (
      let i = 0, deletePos = deleteStart;
      deletePos < deleteEnd;
      i++, deletePos++
    ) {
      if (insert[i] === undefined) {
        // pure removal
        operationCandidates.push({
          type: "remove",
          shiftedIdx: deletePos,
          sourceArrayRemovalBatchStartIdx,
          sourceArrayRemovalBatchPosition: batchRemovalsCount,
        });
        batchRemovalsCount++;
      } else {
        // replace
        operationCandidates.push({
          type: "replace",
          value: insert[i],
          shiftedIdx: deletePos,
          removedValue: leftArr[sourceArrayRemovalBatchStartIdx + i],
        });
        insertIdxShift++;
      }
    }

    for (let i = insertIdxShift; i < insert.length; i++) {
      operationCandidates.push({
        type: "add",
        value: insert[i],
        totalShiftedIdx: deleteStart + i,
      });
      batchAdditionsCount++;
    }

    totalAdditionsCount += batchAdditionsCount;
    totalRemovalsCount += batchRemovalsCount;
  }

  if (lcsI < leftArr.length) {
    lcsLength += leftArr.length - lcsI;
  }

  if (lcsLength < 1) {
    operations.push({
      op: "replace",
      path,
      value: rightArr,
    });
    return;
  }

  if (shouldDetectMoveOperations) {
    detectMoveOperations(operationCandidates, compareFunc, leftArr);
  }

  mapOperationCandidatesToOperations(
    operationCandidates,
    operations,
    path,
    compareFunc,
    shouldDetectMoveOperations
  );
}

function mapOperationCandidatesToOperations(
  operationCandidates: OperationCandidate[],
  outputOperations: RFC6902.Operation[],
  path: string,
  compareFunc: CompareFunc,
  shouldDetectMoveOperations: boolean
) {
  for (let i = 0; i < operationCandidates.length; i++) {
    const candidate = operationCandidates[i];
    switch (candidate.type) {
      case "add": {
        outputOperations.push({
          op: "add",
          path: `${path}/${candidate.totalShiftedIdx}`,
          value: candidate.value,
        });
        break;
      }
      case "remove": {
        const removalIdx =
          candidate.shiftedIdx - candidate.sourceArrayRemovalBatchPosition;

        outputOperations.push({
          op: "remove",
          path: `${path}/${removalIdx}`,
        });
        break;
      }
      case "replace": {
        diffUnknownValues(
          candidate.removedValue,
          candidate.value,
          compareFunc,
          `${path}/${candidate.shiftedIdx}`,
          true,
          outputOperations,
          shouldDetectMoveOperations
        );
        break;
      }
      case "move": {
        outputOperations.push({
          op: "move",
          path: `${path}/${candidate.toShiftedIdx}`,
          from: `${path}/${candidate.fromShiftedIdx}`,
        });
        break;
      }
    }
  }
}

function detectMoveOperations(
  candidates: OperationCandidate[],
  compareFunc: CompareFunc,
  leftArr: Array<unknown>
) {
  for (let i = candidates.length - 1; i >= 0; i--) {
    const candidateI = candidates[i];

    if (candidateI.type !== "add" && candidateI.type !== "remove") {
      continue;
    }

    const candidateIValue =
      candidateI.type === "add"
        ? candidateI.value
        : leftArr[
            candidateI.sourceArrayRemovalBatchStartIdx +
              candidateI.sourceArrayRemovalBatchPosition
          ];

    for (let j = i - 1; j >= 0; j--) {
      const candidateJ = candidates[j];

      if (candidateJ.type === candidateI.type) {
        continue;
      }
      if (candidateJ.type !== "add" && candidateJ.type !== "remove") {
        continue;
      }

      const candidateJValue =
        candidateJ.type === "add"
          ? candidateJ.value
          : leftArr[
              candidateJ.sourceArrayRemovalBatchStartIdx +
                candidateJ.sourceArrayRemovalBatchPosition
            ];

      if (!compareFunc(candidateIValue, candidateJValue)) {
        continue;
      }

      const addOperationCandidate = (
        candidateI.type === "add" ? candidateI : candidateJ
      ) as AddOperationCandidate;

      const removeOperationCandidate = (
        candidateI.type === "remove" ? candidateI : candidateJ
      ) as RemoveOperationCandidate;

      // const candidateJTotalIndexShift =
      //   candidateJ.indexShifts.additionsIdxShift -
      //   candidateJ.indexShifts.removalsIdxShift;
      //
      // const fromIdxShift =
      //   candidateITotalIndexShift - candidateJTotalIndexShift;

      candidates[j] = {
        type: "move",
        fromShiftedIdx:
          // removeOperationCandidate.totalShiftedIdx >
          // addOperationCandidate.totalShiftedIdx
          //   ? removeOperationCandidate.totalShiftedIdx - fromIdxShift
          //   :
          removeOperationCandidate.shiftedIdx,
        toShiftedIdx: addOperationCandidate.totalShiftedIdx,
        value: addOperationCandidate.value,
      };
      candidates.splice(i, 1);

      break;
    }
  }
}
