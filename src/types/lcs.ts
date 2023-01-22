export type RemoveOperationCandidate = {
  type: "remove";
  sourceArrayRemovalBatchStartIdx: number;
  sourceArrayRemovalBatchPosition: number;
  shiftedIdx: number;
};

export type AddOperationCandidate = {
  type: "add";
  value: unknown;
  totalShiftedIdx: number;
};

export type OperationCandidate =
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
