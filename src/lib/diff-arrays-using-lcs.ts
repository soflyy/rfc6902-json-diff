import type { ComparableArray, CompareFunc, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";
import { calcPatch } from "./util/fast-myers-diff";

type RemoveOperationCandidate = {
  type: "remove";
  value: unknown;
  sourceArrayRemovalBatchPosition: number;
  totalShiftedIdx: number;
};

type AddOperationCandidate = {
  type: "add";
  value: unknown;
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
function mapOperationCandidatesToOperations(
  operationCandidates: OperationCandidate[],
  outputOperations: RFC6902.Operation[],
  path: string,
  compareFunc: CompareFunc,
  shouldDetectMoveOperations: boolean
) {
  for (const candidate of operationCandidates) {
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
          candidate.totalShiftedIdx - candidate.sourceArrayRemovalBatchPosition;

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

export function getLcsBasedOperations<T>(
  leftArr: T[],
  rightArr: T[],
  compareFunc: CompareFunc,
  path: string,
  outputOperations: RFC6902.Operation[] = [],
  shouldDetectMoveOperations = false
): RFC6902.Operation[] {
  const operationCandidates: OperationCandidate[] = [];

  const fastMyersDiffIterator = calcPatch(leftArr, rightArr, (l, r) =>
    compareFunc(leftArr[l], rightArr[r])
  );

  // console.log(
  //   "lcs",
  //   Array.from(
  //     lcs(leftArr, rightArr, (l, r) => compareFunc(leftArr[l], rightArr[r]))
  //   )
  // );

  let totalRemovalsCount = 0;
  let totalAdditionsCount = 0;

  let lcsLength = 0;
  let lcsI = 0;

  for (const diffEntry of fastMyersDiffIterator) {
    let [deleteStart, deleteEnd] = diffEntry;
    const [, , insert] = diffEntry;

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
          value: leftArr[deletePos],
          totalShiftedIdx: deletePos,
          sourceArrayRemovalBatchPosition: batchRemovalsCount,
        });
        batchRemovalsCount++;
      } else {
        // replace
        operationCandidates.push({
          type: "replace",
          value: insert[i],
          shiftedIdx: deletePos,
          removedValue: leftArr[deletePos],
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

  // console.log({
  //   leftArr,
  //   rightArr,
  //   lcsLength,
  //   operationCandidates,
  // });
  if (lcsLength < 1) {
    outputOperations.push({
      op: "replace",
      path,
      value: rightArr,
    });
    return outputOperations;
  }

  // console.log({ operationCandidates });
  // const batchOfChanges: LCSChange[] = [];
  // const batchAdditionChanges: LCSChange[] = [];
  // const batchRemovalChanges: LCSChange[] = [];

  if (shouldDetectMoveOperations) {
    // detectMoveOperations(operationCandidates, compareFunc);
  }

  mapOperationCandidatesToOperations(
    operationCandidates,
    outputOperations,
    path,
    compareFunc,
    shouldDetectMoveOperations
  );

  // console.log({
  //   leftArr,
  //   rightArr,
  //   lcsLength,
  //   operationCandidates,
  //   outputOperations,
  // });

  return outputOperations;
}

// function detectMoveOperations(
//   candidates: OperationCandidate[],
//   compareFunc: CompareFunc
// ) {
//   for (let i = candidates.length - 1; i >= 0; i--) {
//     const candidateI = candidates[i];
//
//     if (candidateI.type !== "add" && candidateI.type !== "remove") {
//       continue;
//     }
//
//     const candidateITotalIndexShift =
//       candidateI.indexShifts.additionsIdxShift -
//       candidateI.indexShifts.removalsIdxShift;
//
//     for (let j = i - 1; j >= 0; j--) {
//       const candidateJ = candidates[j];
//
//       if (candidateJ.type === candidateI.type) {
//         continue;
//       }
//       if (candidateJ.type !== "add" && candidateJ.type !== "remove") {
//         continue;
//       }
//       if (!compareFunc(candidateI.value, candidateJ.value)) {
//         continue;
//       }
//
//       const addOperationCandidate = (
//         candidateI.type === "add" ? candidateI : candidateJ
//       ) as AddOperationCandidate;
//
//       const removeOperationCandidate = (
//         candidateI.type === "remove" ? candidateI : candidateJ
//       ) as RemoveOperationCandidate;
//
//       const candidateJTotalIndexShift =
//         candidateJ.indexShifts.additionsIdxShift -
//         candidateJ.indexShifts.removalsIdxShift;
//
//       const fromIdxShift =
//         candidateITotalIndexShift - candidateJTotalIndexShift;
//
//       candidates[j] = {
//         type: "move",
//         fromShiftedIdx:
//           removeOperationCandidate.totalShiftedIdx >
//           addOperationCandidate.totalShiftedIdx
//             ? removeOperationCandidate.totalShiftedIdx - fromIdxShift
//             : removeOperationCandidate.totalShiftedIdx,
//         toShiftedIdx: addOperationCandidate.totalShiftedIdx,
//         value: addOperationCandidate.value,
//       };
//       candidates.splice(i, 1);
//
//       break;
//     }
//   }
// }
