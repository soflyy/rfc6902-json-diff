import type { ComparableRecord, RFC6902 } from "../types";
import { diffUnknownValues } from "./diff-unknown-values";

/**
 * ┌─────────────────────┬─────────────────┬─────────────────┬──────────────┬────────────────┐
 * │       (index)       │       hz        │ margin of error │ runs sampled │ numTimesFaster │
 * ├─────────────────────┼─────────────────┼─────────────────┼──────────────┼────────────────┤
 * │         in          │ '1,013,226,071' │    '±0.20%'     │      99      │      4.95      │
 * │ keys array indexOf  │ '1,009,080,312' │    '±0.20%'     │      99      │      4.93      │
 * │ keys array includes │ '1,007,747,506' │    '±0.20%'     │      98      │      4.92      │
 * │     reflect has     │  '216,295,810'  │    '±0.22%'     │      99      │      1.06      │
 * │   hasOwnProperty    │  '204,669,307'  │    '±0.27%'     │      97      │       1        │
 * └─────────────────────┴─────────────────┴─────────────────┴──────────────┴────────────────┘
 */

export function diffObjects(
  leftObj: ComparableRecord,
  rightObj: ComparableRecord,
  path = "",
  operations: RFC6902.Operation[] = []
): RFC6902.Operation[] {
  const leftKeys = Object.keys(leftObj);
  const rightKeys = Object.keys(rightObj);

  if (leftKeys.length === 0 && rightKeys.length === 0) {
    return operations;
  }

  for (let i = leftKeys.length - 1; i >= 0; i--) {
    const leftKey = leftKeys[i];

    diffUnknownValues(
      leftObj[leftKey],
      rightObj[leftKey],
      `${path}/${leftKey}`,
      leftKey in rightObj,
      operations
    );
  }

  for (let i = 0; i < rightKeys.length; i++) {
    const rightKey = rightKeys[i];

    if (!(rightKey in leftObj) && rightObj[rightKey] !== undefined) {
      operations.push({
        op: "add",
        path: `${path}/${rightKey}`,
        value: rightObj[rightKey],
      });
    }
  }

  return operations;
}
