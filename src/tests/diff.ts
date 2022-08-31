import test from "ava";

import { compare } from "../lib/diff";
import { DiffTestCase, allCases } from "./_diff-test-data";
import { applyPatch as fastJsonPatchApplyPatch } from "fast-json-patch";
import { cloneDeep } from "lodash";

const diffMacro = test.macro((t, { left, right, expected }: DiffTestCase) => {
  const leftClone = cloneDeep(left);
  const rightClone = cloneDeep(right);
  const diffClone = cloneDeep(expected);

  const { newDocument } = fastJsonPatchApplyPatch(leftClone, diffClone);

  t.deepEqual(newDocument, rightClone, "Diff applying failure");

  t.deepEqual(compare(left, right), expected, "Diff generation failure");
});

for (const testCase of allCases) {
  if ("skip" in testCase && testCase.skip) {
    test.skip(testCase.title, diffMacro, testCase);
  } else if ("only" in testCase && testCase.only) {
    test.only(testCase.title, diffMacro, testCase);
  } else {
    test(testCase.title, diffMacro, testCase);
  }
}
