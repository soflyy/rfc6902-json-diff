import type { ComparableArray, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";
import bestSubSequence from "fast-array-diff/dist/diff/lcs";
import equal from "fast-deep-equal";

type RemoveOperationCandidate = {
  type: "remove";
  value: unknown;
  idx: number;
  shiftedIdx: number;
  shiftedRemovalIdx: number;
};
type AddOperationCandidate = {
  type: "add";
  value: unknown;
  idx: number;
  shiftedIdx: number;
};

type OperationCandidate =
  | RemoveOperationCandidate
  | AddOperationCandidate
  | {
      type: "replace";
      value: unknown;
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
  leftArr: T[],
  rightArr: T[],
  compareFunc: (ia: unknown, ib: unknown) => boolean,
  path: string,
  outputOperations: RFC6902.Operation[] = [],
  shouldDetectMoveOperations = false
): RFC6902.Operation[] {
  let lcsLength = -1;

  const changes: Array<{
    type: "add" | "remove" | "same";
    oldStart: number;
    oldEnd: number;
    newStart: number;
    newEnd: number;
    // removeAfterAdd?: {
    //   type: "add";
    //   oldStart: number;
    //   oldEnd: number;
    //   newStart: number;
    //   newEnd: number;
    // };
  }> = [];

  let lastAdd: typeof changes = [];
  // let lastRemove: typeof changes[number] = [];

  function pushChange(
    type: "add" | "remove" | "same",
    _oldArr: T[],
    oldStart: number,
    oldEnd: number,
    _newArr: T[],
    newStart: number,
    newEnd: number
  ) {
    const change: typeof changes[number] = {
      type,
      oldStart,
      oldEnd,
      newStart,
      newEnd,
    };

    if (type === "same") {
      lcsLength++;
      lastAdd = [];
    } else if (type === "add") {
      lastAdd.push(change);
    } else if (type === "remove") {
      // lastRemove = change;

      if (lastAdd.length > 0) {
        // lastAdd.forEach((add) => (add.oldStart += oldEnd - oldStart));
        // change.removeAfterAdd = lastAdd;
        // change.oldStart = oldEnd - oldStart;
      }
    }

    changes.push(change);
  }

  bestSubSequence(leftArr, rightArr, compareFunc, pushChange);

  pushChange("same", [], 0, 0, [], 0, 0);

  if (lcsLength <= 0) {
    outputOperations.push({ op: "replace", path, value: rightArr });

    return outputOperations;
  }

  const operationCandidates: OperationCandidate[] = [];

  for (const change of changes) {
    const idx = change.oldStart;

    if (change.type === "remove") {
      const leftArrayItemsToRemove = leftArr.slice(
        change.oldStart,
        change.oldEnd
      );

      leftArrayItemsToRemove.forEach((leftArrItemToRemove) => {
        operationCandidates.push({
          type: "remove",
          value: leftArrItemToRemove,
          idx: idx,
          shiftedIdx: 0,
          shiftedRemovalIdx: 0,
        });
      });
    } else if (change.type === "add") {
      const rightArrayItemsToAdd = rightArr.slice(
        change.newStart,
        change.newEnd
      );

      rightArrayItemsToAdd.forEach((rightArrItemToAdd) => {
        operationCandidates.push({
          type: "add",
          value: rightArrItemToAdd,
          idx: idx,
          shiftedIdx: 0,
        });
      });
    }
  }

  console.log({
    leftArr,
    rightArr,
    changes,
    operationCandidates: operationCandidates,
  });

  calculateShiftIndices(operationCandidates);

  console.log({
    leftArr,
    rightArr,
    operationCandidatesWIndicesShifted: operationCandidates,
  });

  detectReplaceOperations(operationCandidates);

  console.log({
    leftArr,
    rightArr,
    operationCandidatesWithReplaces: operationCandidates,
  });

  if (shouldDetectMoveOperations) {
    detectMoveOperations(operationCandidates, compareFunc);
    console.log({
      leftArr,
      rightArr,
      operationCandidatesWithReplacesAndMoves: operationCandidates,
    });
  }

  for (const candidate of operationCandidates) {
    if (candidate.type === "remove") {
      outputOperations.push({
        op: "remove",
        path: `${path}/${candidate.shiftedRemovalIdx}`,
      });
    } else if (candidate.type === "add") {
      outputOperations.push({
        op: "add",
        path: `${path}/${candidate.shiftedIdx}`,
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
        `${path}/${candidate.shiftedIdx}`,
        true,
        outputOperations,
        shouldDetectMoveOperations
      );
    }
  }

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

      if (
        addOperationCandidate.shiftedIdx !== removeOperationCandidate.shiftedIdx
      ) {
        continue;
      }

      candidates[j] = {
        type: "replace",
        value: addOperationCandidate.value,
        shiftedIdx: removeOperationCandidate.shiftedIdx,
      };

      candidates.splice(i, 1);

      break;
    }
  }
}

function detectMoveOperations(
  candidates: OperationCandidate[],
  compareFunc: (ia: unknown, ib: unknown) => boolean
) {
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i].type !== "add" && candidates[i].type !== "remove") {
      continue;
    }

    for (let j = candidates.length - 1; j > i; j--) {
      if (candidates[j].type === candidates[i].type) {
        continue;
      }
      if (candidates[j].type !== "add" && candidates[j].type !== "remove") {
        continue;
      }
      if (!compareFunc(candidates[i].value, candidates[j].value)) {
        continue;
      }

      const addOperationCandidate = (
        candidates[i].type === "add" ? candidates[i] : candidates[j]
      ) as AddOperationCandidate;

      const removeOperationCandidate = (
        candidates[i].type === "remove" ? candidates[i] : candidates[j]
      ) as RemoveOperationCandidate;

      const toIdxShift = 0;
      const fromIdxShift =
        removeOperationCandidate.idx > addOperationCandidate.idx ? -1 : 0;
      // const toIdxShift =
      //   addOperationCandidate.idx > removeOperationCandidate.idx ? +1 : 0;

      candidates[i] = {
        type: "move",
        fromShiftedIdx: removeOperationCandidate.shiftedIdx + fromIdxShift,
        toShiftedIdx: addOperationCandidate.shiftedIdx + toIdxShift,
        value: addOperationCandidate.value,
      };
      candidates.splice(j, 1);
    }
  }
}

function calculateShiftIndices(operationCandidates: OperationCandidate[]) {
  let totalAdditionsIdxShift = 0;
  let totalRemovalsIdxShift = 0;

  const idxShiftMap = [];

  for (const candidate of operationCandidates) {
    if (candidate.type !== "add" && candidate.type !== "remove") {
      continue;
    }
    const originalCandidateIdx = candidate.idx;

    if (idxShiftMap[originalCandidateIdx] === undefined) {
      idxShiftMap[originalCandidateIdx] = {
        additionsIdxShift: 0,
        removalsIdxShift: 0,
      };
    }

    const totalIdxShift = totalAdditionsIdxShift - totalRemovalsIdxShift;

    const currentIdxShift =
      idxShiftMap[originalCandidateIdx].additionsIdxShift -
      idxShiftMap[originalCandidateIdx].removalsIdxShift;

    const totalMinusCurrentIdxShift = totalIdxShift - currentIdxShift;

    if (candidate.type === "add") {
      console.log("add", {
        candidate,
        originalCandidateIdx,
      });
      // console.log(
      //   "add",
      //   candidate.idx,
      //   candidate.value,
      //   idxShiftMap[originalCandidateIdx].additionsIdxShift +
      //     totalMinusCurrentIdxShift
      // );
      candidate.idx += idxShiftMap[originalCandidateIdx].additionsIdxShift;

      candidate.shiftedIdx = candidate.idx + totalMinusCurrentIdxShift;

      totalAdditionsIdxShift++;
      idxShiftMap[originalCandidateIdx].additionsIdxShift++;
    } else if (candidate.type === "remove") {
      // console.log("remove", {
      //   idx: candidate.idx,
      //   val: candidate.value,
      //   removalsIdxShift: idxShiftMap[originalCandidateIdx].removalsIdxShift,
      //   totalIdxShift,
      //   totalMinusCurrentIdxShift,
      // });
      candidate.idx += idxShiftMap[originalCandidateIdx].removalsIdxShift;

      candidate.shiftedIdx = candidate.idx + totalMinusCurrentIdxShift;

      // const currentRemovalsMinusAdditions =
      //   idxShiftMap[originalCandidateIdx].additionsIdxShift > 0
      //     ? idxShiftMap[originalCandidateIdx].removalsIdxShift -
      //       idxShiftMap[originalCandidateIdx].additionsIdxShift +
      //       1
      //     : 0;

      console.log("remove", {
        candidate,
        // currentRemovalsMinusAdditions,
        originalCandidateIdx,
      });

      candidate.shiftedRemovalIdx =
        originalCandidateIdx + totalIdxShift - currentIdxShift;
      // + currentRemovalsMinusAdditions;

      totalRemovalsIdxShift++;
      idxShiftMap[originalCandidateIdx].removalsIdxShift++;
    }
  }
}
