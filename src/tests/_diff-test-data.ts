import type { RFC6902, ComparableValue } from "../types";

import jsonPatchTests from "./json-patch-tests.json";

export type JsonPatchTestDef = {
  comment?: string;
  doc: ComparableValue;
  patch: RFC6902.Operation[];
} & ({ expected: ComparableValue } | { error: string });

export type DiffTestCase = ({ skip?: boolean } | { only?: boolean }) & {
  title: string;
  left: ComparableValue;
  right: ComparableValue;
  expected: RFC6902.Operation[];
};

export const thirdPartyCases: DiffTestCase[] = (
  jsonPatchTests as JsonPatchTestDef[]
)
  .filter(
    (def): def is Exclude<JsonPatchTestDef, { error: string }> =>
      "expected" in def
  )
  .map((def, i) => ({
    title: def.comment ?? `Unknown #${i}`,
    left: def.doc,
    right: def.expected,
    expected: def.patch,
  }));

export const singleDimensionalArrayOfPrimitivesCases: DiffTestCase[] = [
  {
    title: "Empty Arrays Are Equal",
    left: [],
    right: [],
    expected: [],
  },
  {
    title: "Arrays With Single Element Are Equal",
    left: [true],
    right: [true],
    expected: [],
  },
  {
    title: "Arrays With Single Element Are Not Equal",
    left: [true],
    right: [false],
    expected: [{ op: "replace", path: "/0", value: false }],
  },
  {
    title: "Arrays With String And Number Elements Are Not Equal",
    left: ["100"],
    right: [100],
    expected: [{ op: "replace", path: "/0", value: 100 }],
  },
  {
    title: "Arrays With Float And Int Elements Are Equal",
    left: [100],
    right: [100.0],
    expected: [],
  },
  {
    title: "Append 1 Array Item To Array Of 1 Element",
    left: ["A"],
    right: ["A", "B"],
    expected: [{ op: "add", path: "/1", value: "B" }],
  },
  {
    title: "Append 1 Array Item To Array Of 2 Elements",
    left: ["A", "B"],
    right: ["A", "B", "C"],
    expected: [{ op: "add", path: "/2", value: "C" }],
  },
  {
    title: "Append 1 Array Item To Array Of 3 Elements",
    left: ["A", "B", "C"],
    right: ["A", "B", "C", "D"],
    expected: [{ op: "add", path: "/3", value: "D" }],
  },
  {
    title: "Append 3 Array Items To Array Of 1 Element",
    left: ["A"],
    right: ["A", "B", "C", "D", "E", "F"],
    expected: [
      { op: "add", path: "/1", value: "B" },
      { op: "add", path: "/2", value: "C" },
      { op: "add", path: "/3", value: "D" },
      { op: "add", path: "/4", value: "E" },
      { op: "add", path: "/5", value: "F" },
    ],
  },
  {
    title: "Append 3 Array Items To Array Of 3 Elements",
    left: ["A", "B", "C"],
    right: ["A", "B", "C", "D", "E", "F"],
    expected: [
      { op: "add", path: "/3", value: "D" },
      { op: "add", path: "/4", value: "E" },
      { op: "add", path: "/5", value: "F" },
    ],
  },
  {
    title: "Prepend 3 Array Items To Array Of 1 Element",
    left: ["D"],
    right: ["A", "B", "C", "D"],
    expected: [
      { op: "add", path: "/0", value: "A" },
      { op: "add", path: "/1", value: "B" },
      { op: "add", path: "/2", value: "C" },
    ],
  },
  {
    title: "Prepend 3 Array Items To Array Of 3 Elements",
    left: ["D", "E", "F"],
    right: ["A", "B", "C", "D", "E", "F"],
    expected: [
      { op: "add", path: "/0", value: "A" },
      { op: "add", path: "/1", value: "B" },
      { op: "add", path: "/2", value: "C" },
    ],
  },
  {
    title: "Add 1 Array Item In The Middle Of Array",
    left: ["A", "B", "D", "E", "F"],
    right: ["A", "B", "C", "D", "E", "F"],
    expected: [{ op: "add", path: "/2", value: "C" }],
  },
  {
    title: "Remove 1 Array Item From The Middle Of Array",
    left: ["A", "B", "C", "D", "E", "F"],
    right: ["A", "B", "D", "E", "F"],
    expected: [{ op: "remove", path: "/2" }],
  },
  {
    title: "Add 4 Array Items In The Middle Of Array",
    left: ["A", "B", "D", "E", "F"],
    right: ["A", "B", "C", 1, 2, 3, "D", "E", "F"],
    expected: [
      { op: "add", path: "/2", value: "C" },
      { op: "add", path: "/3", value: 1 },
      { op: "add", path: "/4", value: 2 },
      { op: "add", path: "/5", value: 3 },
    ],
  },
  {
    title: "Remove 4 Array Items From The Middle Of Array",
    left: ["A", "B", "C", 1, 2, 3, "D", "E", "F"],
    right: ["A", "B", "D", "E", "F"],
    expected: [
      { op: "remove", path: "/2" },
      { op: "remove", path: "/2" },
      { op: "remove", path: "/2" },
      { op: "remove", path: "/2" },
    ],
  },
  {
    title: "Prepend 3 & Append 3 Items To Array",
    left: [1, 2, 3],
    right: ["A", "B", "C", 1, 2, 3, "D", "E", "F"],

    expected: [
      { op: "add", path: "/0", value: "A" },
      { op: "add", path: "/1", value: "B" },
      { op: "add", path: "/2", value: "C" },
      { op: "add", path: "/6", value: "D" },
      { op: "add", path: "/7", value: "E" },
      { op: "add", path: "/8", value: "F" },
    ],
  },
  {
    title: "Prepend 3 & Remove 3 Tail Items Of Array",
    left: [1, 2, 3, "D", "E", "F"],
    right: ["A", "B", "C", 1, 2, 3],
    expected: [
      { op: "add", path: "/0", value: "A" },
      { op: "add", path: "/1", value: "B" },
      { op: "add", path: "/2", value: "C" },
      { op: "remove", path: "/6" },
      { op: "remove", path: "/6" },
      { op: "remove", path: "/6" },
    ],
  },
  {
    title: "Append 3 & Remove 3 Head Items Of Array",
    left: ["A", "B", "C", 1, 2, 3],
    right: [1, 2, 3, "D", "E", "F"],
    expected: [
      { op: "remove", path: "/0" },
      { op: "remove", path: "/0" },
      { op: "remove", path: "/0" },
      { op: "add", path: "/3", value: "D" },
      { op: "add", path: "/4", value: "E" },
      { op: "add", path: "/5", value: "F" },
    ],
  },

  {
    // only: true,
    title: "Append 3, Prepend 3 & Remove 3 Head Items Of Array",
    left: ["A", "B", "C", 1, 2, 3],
    right: ["I", "O", "P", 1, 2, 3, "D", "E", "F"],
    expected: [
      { op: "replace", path: "/0", value: "I" },
      { op: "replace", path: "/1", value: "O" },
      { op: "replace", path: "/2", value: "P" },
      { op: "add", path: "/6", value: "D" },
      { op: "add", path: "/7", value: "E" },
      { op: "add", path: "/8", value: "F" },
    ],
  },

  {
    title: "Foo Append 3, Prepend 3 & Remove 3 Head Items Of Array",
    left: ["A", "B", "C", "O", 1, 2, 3],
    right: ["I", "O", "P", 1, 2, 3, "D", "E", "F"],
    expected: [
      { op: "remove", path: "/0" },
      { op: "remove", path: "/0" },
      { op: "replace", path: "/0", value: "I" },
      { op: "add", value: "P", path: "/2" },
      { op: "add", value: "D", path: "/6" },
      { op: "add", value: "E", path: "/7" },
      { op: "add", value: "F", path: "/8" },
    ],
  },

  {
    title: "Array Of 3 Items Changed Completely",
    left: ["A", "B", "C"],
    right: ["I", "O", "P", "J"],
    expected: [
      { op: "add", path: "/3", value: "J" },
      { op: "replace", path: "/0", value: "I" },
      { op: "replace", path: "/1", value: "O" },
      { op: "replace", path: "/2", value: "P" },
    ],
  },
];

export const objectCases: DiffTestCase[] = [
  {
    title: "Empty string object keys",
    left: { key: { "": "" } },
    right: { key: { "": "", foo: "bar" } },
    expected: [{ op: "add", path: "/key/foo", value: "bar" }],
  },
  {
    title: "Undefined left values",
    left: { foo: undefined },
    right: { foo: { id: 100 } },
    expected: [{ op: "replace", path: "/foo", value: { id: 100 } }],
  },

  // TODO: Since it's a JSON-patch, and JSON doesn't support "undefined", it should use "remove" instead. Not a big deal, but generated patches cannot be sent as JSON document
  {
    title: "Undefined right values",
    left: { foo: { id: 100 } },
    right: { foo: undefined },
    expected: [{ op: "replace", path: "/foo", value: undefined }],
  },

  {
    title: "Nested objects change",
    left: {
      tree: {
        leaf1: { id: 100 },
        leaf2: { id: 101 },
      },
    },
    right: {
      tree: {
        leaf1: { id: 100 },
        leaf2: { id: 102 },
      },
    },
    expected: [{ op: "replace", path: "/tree/leaf2/id", value: 102 }],
  },

  {
    title: "Nested objects change, the whole object changed to another object",
    left: {
      tree: {
        leaf1: { id: 100 },
        leaf2: { id: 101 },
      },
    },
    right: {
      tree: {
        leaf1: { id: 100 },
        leaf2: { no_id: true },
      },
    },
    expected: [
      // TODO weirdo, one replace?
      { op: "remove", path: "/tree/leaf2/id" },
      { op: "add", path: "/tree/leaf2/no_id", value: true },
    ],
  },

  {
    title: "Nested objects change, the whole object changed to primitive ",
    left: {
      tree: {
        leaf1: { id: 100 },
        leaf2: { id: 101 },
      },
    },
    right: {
      tree: {
        leaf1: { id: 100 },
        leaf2: "hello",
      },
    },
    expected: [{ op: "replace", path: "/tree/leaf2", value: "hello" }],
  },

  {
    title: "Nested objects change, the whole object changed to null",
    left: {
      tree: {
        leaf1: { id: 100 },
        leaf2: { id: 101 },
      },
    },
    right: {
      tree: {
        leaf1: { id: 100 },
        leaf2: null,
      },
    },
    expected: [{ op: "replace", path: "/tree/leaf2", value: null }],
  },

  {
    title: "Nested objects change, the primitive changed to object",
    left: {
      tree: {
        leaf1: { id: 100 },
        leaf2: 500,
      },
    },
    right: {
      tree: {
        leaf1: { id: 100 },
        leaf2: { foo: 1, bar: 2 },
      },
    },
    expected: [
      { op: "replace", path: "/tree/leaf2", value: { foo: 1, bar: 2 } },
    ],
  },
];

export const multiDimensionalArrayCases: DiffTestCase[] = [
  {
    title: "Replace last element with array",
    left: [1, 2, 3],
    right: [1, 2, [4, 5]],
    expected: [{ op: "replace", path: "/2", value: [4, 5] }],
  },
  {
    title: "Replace first element with array",
    left: [1, 2, 3],
    right: [[4, 5], 2, 3],
    expected: [{ op: "replace", path: "/0", value: [4, 5] }],
  },
  {
    title: "Replace middle element with array",
    left: [1, 2, 3],
    right: [1, [4, 5], 3],
    expected: [{ op: "replace", path: "/1", value: [4, 5] }],
  },

  {
    title: "Replace first element of nested array",
    left: [1, 2, [3, 4]],
    right: [1, 2, [3, 5]],
    expected: [{ op: "replace", path: "/2/1", value: 5 }],
  },
  {
    title: "Replace primitive element of deeply nested array",
    left: [1, 2, [3, 4, [5, [6, 7, 8, 9]], 10]],
    right: [1, 2, [3, 4, [5, [6, 7, "X", 9]], 10]],
    expected: [{ op: "replace", path: "/2/2/1/2", value: "X" }],
  },

  {
    title: "Change object property of deeply nested array",
    left: [
      1,
      2,
      [3, 4, [5, [6, 7, { foo: "bar", baz: { x: 0, y: 0 } }, 9]], 10],
    ],
    right: [
      1,
      2,
      [3, 4, [5, [6, 7, { foo: "bar", baz: { x: 1, y: 0 } }, 9]], 10],
    ],
    expected: [{ op: "replace", path: "/2/2/1/2/baz/x", value: 1 }],
  },
];

export const arrayCasesInsideObjectProperty: DiffTestCase[] = [
  ...singleDimensionalArrayOfPrimitivesCases,
  ...multiDimensionalArrayCases,
].map((arrayCase) => ({
  title: `Array Case Inside Object Property: ${arrayCase.title}`,
  left: { prop: arrayCase.left },
  right: { prop: arrayCase.right },
  expected: arrayCase.expected.map((arrayCaseExpectedOp) => ({
    ...arrayCaseExpectedOp,
    path: `/prop${arrayCaseExpectedOp.path}`,
  })),
}));

export const arrayCasesInsideNestedObjectProperty: DiffTestCase[] = [
  ...singleDimensionalArrayOfPrimitivesCases,
  ...multiDimensionalArrayCases,
].map((arrayCase) => ({
  title: `Array Case Inside Nested Object Property: ${arrayCase.title}`,
  left: { prop: { foo: arrayCase.left } },
  right: { prop: { foo: arrayCase.right } },
  expected: arrayCase.expected.map((arrayCaseExpectedOp) => ({
    ...arrayCaseExpectedOp,
    path: `/prop/foo${arrayCaseExpectedOp.path}`,
  })),
}));

export const otherCasesInsideMultidimensionalArrays: DiffTestCase[] = [
  ...objectCases,
  ...singleDimensionalArrayOfPrimitivesCases,
  ...arrayCasesInsideObjectProperty,
  ...arrayCasesInsideNestedObjectProperty,
].map((wrappedCase) => ({
  title: `Case Inside Multidimensional Array: ${wrappedCase.title}`,
  left: [1, 2, [3, 4, [5, [6, 7, wrappedCase.left, 9]], 10]],
  right: [1, 2, [3, 4, [5, [6, 7, wrappedCase.right, 9]], 10]],
  expected: wrappedCase.expected.map((objectCaseExpectedOp) => ({
    ...objectCaseExpectedOp,
    path: `/2/2/1/2${objectCaseExpectedOp.path}`,
  })),
}));

export const allCases: DiffTestCase[] = [
  ...objectCases,
  ...singleDimensionalArrayOfPrimitivesCases,
  ...arrayCasesInsideObjectProperty,
  ...arrayCasesInsideNestedObjectProperty,
  ...thirdPartyCases,
  ...multiDimensionalArrayCases,
  ...otherCasesInsideMultidimensionalArrays,
];
