import type { RFC6902, ComparableValue } from "../types";

import jsonPatchTests from "./json-patch-tests.json";

import { snapshots } from "./_builder-data";

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
    expected: [{ op: "replace", path: "", value: ["I", "O", "P", "J"] }],
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
  {
    title: "Deep Equality Test 1",
    left: {
      parent: {
        children: [1, 2, 3],
      },
    },
    right: {
      parent: {
        children: [1, 2, 3],
      },
    },
    expected: [],
  },
  {
    title: "Deep Equality Test 2",
    left: {
      parent: {
        children: {
          foo: "foo",
          bar: "bar",
          baz: "baz",
        },
      },
    },
    right: {
      parent: {
        children: {
          foo: "foo",
          bar: "bar",
          baz: "baz",
        },
      },
    },
    expected: [],
  },

  {
    title: "Deep Equality Test 3",
    left: {
      parent: {
        children: {
          foo: "foo",
          bar: "bar",
          baz: "baz",
        },
      },
    },
    right: {
      parent: {
        children: {
          foo: "foo",
          bar: "bar",
          baz: "bax",
        },
      },
    },
    expected: [{ op: "replace", path: "/parent/children/baz", value: "bax" }],
  },
  {
    title: "Empty Arrays Should Be Overridden",
    left: {
      parent: {
        children: [],
      },
    },
    right: {
      parent: {
        children: [1],
      },
    },
    expected: [{ op: "add", path: "/parent/children", value: [1] }],
  },
  {
    title: "Object overridden",
    left: [1, 2, {}],
    right: [1, 2, []],
    expected: [{ op: "replace", path: "/2", value: [] }],
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

export const realWorldLargeDocumentCases: DiffTestCase[] = [
  ...snapshots.map(([left, right, expected], i) => ({
    title: `Snapshot ${i}`,
    left: JSON.parse(left),
    right: JSON.parse(right),
    expected,
  })),

  {
    title: "Real-world data issue",
    left: [
      {
        id: 568,
        data: {
          type: "EssentialElements\\Column",
          properties: {
            design: {
              size: {
                width: {
                  unit: "%",
                  number: 33.33,
                  style: "33.33%",
                },
              },
            },
          },
        },
        children: [
          {
            id: 569,
            data: {
              type: "EssentialElements\\Image",
              properties: {
                content: {
                  content: {
                    image: {
                      id: 14150,
                      filename: "horizontal-line.svg",
                      url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                      alt: "",
                      caption: "",
                      mime: "image/svg+xml",
                      type: "image",
                      sizes: {
                        full: {
                          height: 6,
                          width: 67,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        thumbnail: {
                          height: "150",
                          width: "150",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        medium: {
                          height: "300",
                          width: "300",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        large: {
                          height: "1024",
                          width: "1024",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        medium_large: {
                          height: "768",
                          width: "0",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "1536x1536": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "2048x2048": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "sl-small": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "sl-large": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                      },
                      attributes: {
                        srcset: "",
                        sizes: "(max-width: 67px) 100vw, 67px",
                      },
                    },
                  },
                },
                design: {
                  spacing: {
                    margin_bottom: {
                      breakpoint_base: {
                        number: 16,
                        unit: "px",
                        style: "16px",
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 568,
          },
          {
            id: 570,
            data: {
              type: "EssentialElements\\Heading",
              properties: {
                content: {
                  content: {
                    text: "WooCoommerce",
                    tags: "h3",
                  },
                },
                design: {
                  spacing: {
                    margin_bottom: {
                      breakpoint_base: {
                        number: 16,
                        unit: "px",
                        style: "16px",
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 568,
          },
          {
            id: 571,
            data: {
              type: "EssentialElements\\Text",
              properties: {
                content: {
                  content: {
                    text: "Build websites in less time with elements for??every use case.",
                  },
                },
                design: {
                  typography: {
                    color: {
                      breakpoint_base: "var(--bd-palette-color-10)",
                    },
                    typography: {
                      preset: "preset-id-840408c0-dc3b-432e-80bf-aa6361f929b3",
                      previousCustom: {
                        customTypography: [],
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 568,
          },
        ],
        _parentId: 567,
      },
      {
        id: 1731,
        data: {
          type: "EssentialElements\\Column",
          properties: {
            design: {
              size: {
                width: {
                  unit: "%",
                  number: 33.33,
                  style: "33.33%",
                },
              },
            },
          },
        },
        children: [
          {
            id: 1732,
            data: {
              type: "EssentialElements\\Image",
              properties: {
                content: {
                  content: {
                    image: {
                      id: 14150,
                      filename: "horizontal-line.svg",
                      url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                      alt: "",
                      caption: "",
                      mime: "image/svg+xml",
                      type: "image",
                      sizes: {
                        full: {
                          height: 6,
                          width: 67,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        thumbnail: {
                          height: "150",
                          width: "150",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        medium: {
                          height: "300",
                          width: "300",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        large: {
                          height: "1024",
                          width: "1024",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        medium_large: {
                          height: "768",
                          width: "0",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "1536x1536": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "2048x2048": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "sl-small": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "sl-large": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                      },
                      attributes: {
                        srcset: "",
                        sizes: "(max-width: 67px) 100vw, 67px",
                      },
                    },
                  },
                },
                design: {
                  spacing: {
                    margin_bottom: {
                      breakpoint_base: {
                        number: 16,
                        unit: "px",
                        style: "16px",
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 1731,
          },
          {
            id: 1733,
            data: {
              type: "EssentialElements\\Heading",
              properties: {
                content: {
                  content: {
                    text: "WooCoommerce",
                    tags: "h3",
                  },
                },
                design: {
                  spacing: {
                    margin_bottom: {
                      breakpoint_base: {
                        number: 16,
                        unit: "px",
                        style: "16px",
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 1731,
          },
          {
            id: 1734,
            data: {
              type: "EssentialElements\\Text",
              properties: {
                content: {
                  content: {
                    text: "Build websites in less time with elements for??every use case.",
                  },
                },
                design: {
                  typography: {
                    color: {
                      breakpoint_base: "var(--bd-palette-color-10)",
                    },
                    typography: {
                      preset: "preset-id-840408c0-dc3b-432e-80bf-aa6361f929b3",
                      previousCustom: {
                        customTypography: [],
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 1731,
          },
        ],
        _parentId: 567,
      },
      {
        id: 572,
        data: {
          type: "EssentialElements\\Column",
          properties: {
            design: {
              size: {
                width: {
                  unit: "%",
                  number: 33.34,
                  style: "33.34%",
                },
              },
              layout: {
                horizontal: {
                  align: {
                    breakpoint_base: "flex-start",
                  },
                  vertical_align: {
                    breakpoint_base: "center",
                  },
                },
                gap: {
                  breakpoint_base: {
                    number: 20,
                    unit: "px",
                    style: "20px",
                  },
                },
              },
            },
            settings: {
              advanced: {
                wrapper: {
                  layout: {
                    display: {
                      breakpoint_base: "flex",
                    },
                    flex_wrap: {
                      breakpoint_base: "wrap",
                    },
                  },
                },
              },
            },
          },
        },
        children: [
          {
            id: 573,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 574,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 573,
              },
              {
                id: 575,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 573,
              },
            ],
            _parentId: 572,
          },
          {
            id: 576,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 577,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 576,
              },
              {
                id: 578,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 576,
              },
            ],
            _parentId: 572,
          },
          {
            id: 579,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 580,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 579,
              },
              {
                id: 581,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 579,
              },
            ],
            _parentId: 572,
          },
          {
            id: 582,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 583,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 582,
              },
              {
                id: 584,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 582,
              },
            ],
            _parentId: 572,
          },
          {
            id: 585,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 586,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 585,
              },
              {
                id: 587,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 585,
              },
            ],
            _parentId: 572,
          },
          {
            id: 588,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 589,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 588,
              },
              {
                id: 590,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 588,
              },
            ],
            _parentId: 572,
          },
          {
            id: 591,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 592,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 591,
              },
              {
                id: 593,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 591,
              },
            ],
            _parentId: 572,
          },
          {
            id: 594,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 595,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 594,
              },
              {
                id: 596,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 594,
              },
            ],
            _parentId: 572,
          },
          {
            id: 597,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 598,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 597,
              },
              {
                id: 599,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 597,
              },
            ],
            _parentId: 572,
          },
          {
            id: 600,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 601,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 600,
              },
              {
                id: 602,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 600,
              },
            ],
            _parentId: 572,
          },
          {
            id: 603,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 604,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 603,
              },
              {
                id: 605,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 603,
              },
            ],
            _parentId: 572,
          },
          {
            id: 606,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 607,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 606,
              },
              {
                id: 608,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 606,
              },
            ],
            _parentId: 572,
          },
          {
            id: 609,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 610,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 609,
              },
              {
                id: 611,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 609,
              },
            ],
            _parentId: 572,
          },
          {
            id: 612,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 613,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 612,
              },
              {
                id: 614,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 612,
              },
            ],
            _parentId: 572,
          },
          {
            id: 615,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 616,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 615,
              },
              {
                id: 617,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 615,
              },
            ],
            _parentId: 572,
          },
          {
            id: 618,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 619,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 618,
              },
              {
                id: 620,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 618,
              },
            ],
            _parentId: 572,
          },
          {
            id: 621,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 622,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 621,
              },
              {
                id: 623,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 621,
              },
            ],
            _parentId: 572,
          },
          {
            id: 624,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 625,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 624,
              },
              {
                id: 626,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 624,
              },
            ],
            _parentId: 572,
          },
        ],
        _parentId: 567,
      },
    ],
    right: [
      {
        id: 568,
        data: {
          type: "EssentialElements\\Column",
          properties: {
            design: {
              size: {
                width: {
                  number: 25,
                  unit: "%",
                  style: "25%",
                },
              },
            },
          },
        },
        children: [
          {
            id: 569,
            data: {
              type: "EssentialElements\\Image",
              properties: {
                content: {
                  content: {
                    image: {
                      id: 14150,
                      filename: "horizontal-line.svg",
                      url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                      alt: "",
                      caption: "",
                      mime: "image/svg+xml",
                      type: "image",
                      sizes: {
                        full: {
                          height: 6,
                          width: 67,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        thumbnail: {
                          height: "150",
                          width: "150",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        medium: {
                          height: "300",
                          width: "300",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        large: {
                          height: "1024",
                          width: "1024",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        medium_large: {
                          height: "768",
                          width: "0",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "1536x1536": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "2048x2048": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "sl-small": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                        "sl-large": {
                          height: 2000,
                          width: 2000,
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          orientation: "portrait",
                        },
                      },
                      attributes: {
                        srcset: "",
                        sizes: "(max-width: 67px) 100vw, 67px",
                      },
                    },
                  },
                },
                design: {
                  spacing: {
                    margin_bottom: {
                      breakpoint_base: {
                        number: 16,
                        unit: "px",
                        style: "16px",
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 568,
          },
          {
            id: 570,
            data: {
              type: "EssentialElements\\Heading",
              properties: {
                content: {
                  content: {
                    text: "WooCoommerce",
                    tags: "h3",
                  },
                },
                design: {
                  spacing: {
                    margin_bottom: {
                      breakpoint_base: {
                        number: 16,
                        unit: "px",
                        style: "16px",
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 568,
          },
          {
            id: 571,
            data: {
              type: "EssentialElements\\Text",
              properties: {
                content: {
                  content: {
                    text: "Build websites in less time with elements for??every use case.",
                  },
                },
                design: {
                  typography: {
                    color: {
                      breakpoint_base: "var(--bd-palette-color-10)",
                    },
                    typography: {
                      preset: "preset-id-840408c0-dc3b-432e-80bf-aa6361f929b3",
                      previousCustom: {
                        customTypography: [],
                      },
                    },
                  },
                },
              },
            },
            children: [],
            _parentId: 568,
          },
        ],
        _parentId: 567,
      },
      {
        id: 572,
        data: {
          type: "EssentialElements\\Column",
          properties: {
            design: {
              size: {
                width: {
                  unit: "%",
                  number: 75,
                  style: "75%",
                },
              },
              layout: {
                horizontal: {
                  align: {
                    breakpoint_base: "flex-start",
                  },
                  vertical_align: {
                    breakpoint_base: "center",
                  },
                },
                gap: {
                  breakpoint_base: {
                    number: 20,
                    unit: "px",
                    style: "20px",
                  },
                },
              },
            },
            settings: {
              advanced: {
                wrapper: {
                  layout: {
                    display: {
                      breakpoint_base: "flex",
                    },
                    flex_wrap: {
                      breakpoint_base: "wrap",
                    },
                  },
                },
              },
            },
          },
        },
        children: [
          {
            id: 573,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 574,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 573,
              },
              {
                id: 575,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 573,
              },
            ],
            _parentId: 572,
          },
          {
            id: 576,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 577,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 576,
              },
              {
                id: 578,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 576,
              },
            ],
            _parentId: 572,
          },
          {
            id: 579,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 580,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 579,
              },
              {
                id: 581,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 579,
              },
            ],
            _parentId: 572,
          },
          {
            id: 582,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 583,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 582,
              },
              {
                id: 584,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 582,
              },
            ],
            _parentId: 572,
          },
          {
            id: 585,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 586,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 585,
              },
              {
                id: 587,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 585,
              },
            ],
            _parentId: 572,
          },
          {
            id: 588,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 589,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 588,
              },
              {
                id: 590,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 588,
              },
            ],
            _parentId: 572,
          },
          {
            id: 591,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 592,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 591,
              },
              {
                id: 593,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 591,
              },
            ],
            _parentId: 572,
          },
          {
            id: 594,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 595,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 594,
              },
              {
                id: 596,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 594,
              },
            ],
            _parentId: 572,
          },
          {
            id: 597,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 598,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 597,
              },
              {
                id: 599,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 597,
              },
            ],
            _parentId: 572,
          },
          {
            id: 600,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 601,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 600,
              },
              {
                id: 602,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 600,
              },
            ],
            _parentId: 572,
          },
          {
            id: 603,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 604,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 603,
              },
              {
                id: 605,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 603,
              },
            ],
            _parentId: 572,
          },
          {
            id: 606,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 607,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 606,
              },
              {
                id: 608,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 606,
              },
            ],
            _parentId: 572,
          },
          {
            id: 609,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 610,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 609,
              },
              {
                id: 611,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 609,
              },
            ],
            _parentId: 572,
          },
          {
            id: 612,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 613,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 612,
              },
              {
                id: 614,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 612,
              },
            ],
            _parentId: 572,
          },
          {
            id: 615,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 616,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 615,
              },
              {
                id: 617,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 615,
              },
            ],
            _parentId: 572,
          },
          {
            id: 618,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 619,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 618,
              },
              {
                id: 620,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 618,
              },
            ],
            _parentId: 572,
          },
          {
            id: 621,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 622,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 621,
              },
              {
                id: 623,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 621,
              },
            ],
            _parentId: 572,
          },
          {
            id: 624,
            data: {
              type: "EssentialElements\\Div",
              properties: {
                settings: {
                  advanced: {
                    wrapper: {
                      spacing: {
                        padding: {
                          breakpoint_base: {
                            left: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            right: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            top: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                            bottom: {
                              number: 20,
                              unit: "px",
                              style: "20px",
                            },
                          },
                        },
                      },
                      borders: {
                        border: {
                          breakpoint_base: {
                            top: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            bottom: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            left: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                            right: {
                              width: {
                                number: 1,
                                unit: "px",
                                style: "1px",
                              },
                              color: "var(--bd-palette-color-7)",
                              style: "solid",
                            },
                          },
                        },
                        radius: {
                          breakpoint_base: {
                            all: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            topRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomLeft: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            bottomRight: {
                              number: 4,
                              unit: "px",
                              style: "4px",
                            },
                            editMode: "all",
                          },
                        },
                      },
                    },
                  },
                },
                design: {
                  layout: {
                    align: {
                      breakpoint_base: "center",
                    },
                    vertical_align: {
                      breakpoint_base: "center",
                    },
                    gap: {
                      breakpoint_base: {
                        number: 8,
                        unit: "px",
                        style: "8px",
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 625,
                data: {
                  type: "EssentialElements\\Icon",
                  properties: {
                    content: {
                      content: {
                        icon: {
                          slug: "icon-elementicon.",
                          name: "elementicon",
                          svgCode:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                        },
                      },
                    },
                    design: {
                      icon: {
                        size: {
                          breakpoint_base: {
                            number: 28,
                            unit: "px",
                            style: "28px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 624,
              },
              {
                id: 626,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Element",
                      },
                    },
                    design: {
                      typography: {
                        typography: {
                          preset:
                            "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                        color: {
                          breakpoint_base: "var(--bd-palette-color-16)",
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 624,
              },
            ],
            _parentId: 572,
          },
        ],
        _parentId: 567,
      },
    ],
    expected: [
      {
        op: "replace",
        path: "",
        value: [
          {
            id: 568,
            data: {
              type: "EssentialElements\\Column",
              properties: {
                design: {
                  size: {
                    width: {
                      number: 25,
                      unit: "%",
                      style: "25%",
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 569,
                data: {
                  type: "EssentialElements\\Image",
                  properties: {
                    content: {
                      content: {
                        image: {
                          id: 14150,
                          filename: "horizontal-line.svg",
                          url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                          alt: "",
                          caption: "",
                          mime: "image/svg+xml",
                          type: "image",
                          sizes: {
                            full: {
                              height: 6,
                              width: 67,
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            thumbnail: {
                              height: "150",
                              width: "150",
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            medium: {
                              height: "300",
                              width: "300",
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            large: {
                              height: "1024",
                              width: "1024",
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            medium_large: {
                              height: "768",
                              width: "0",
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            "1536x1536": {
                              height: 2000,
                              width: 2000,
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            "2048x2048": {
                              height: 2000,
                              width: 2000,
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            "sl-small": {
                              height: 2000,
                              width: 2000,
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                            "sl-large": {
                              height: 2000,
                              width: 2000,
                              url: "https://breakdance.com/wp-content/uploads/2022/07/horizontal-line.svg",
                              orientation: "portrait",
                            },
                          },
                          attributes: {
                            srcset: "",
                            sizes: "(max-width: 67px) 100vw, 67px",
                          },
                        },
                      },
                    },
                    design: {
                      spacing: {
                        margin_bottom: {
                          breakpoint_base: {
                            number: 16,
                            unit: "px",
                            style: "16px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 568,
              },
              {
                id: 570,
                data: {
                  type: "EssentialElements\\Heading",
                  properties: {
                    content: {
                      content: {
                        text: "WooCoommerce",
                        tags: "h3",
                      },
                    },
                    design: {
                      spacing: {
                        margin_bottom: {
                          breakpoint_base: {
                            number: 16,
                            unit: "px",
                            style: "16px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 568,
              },
              {
                id: 571,
                data: {
                  type: "EssentialElements\\Text",
                  properties: {
                    content: {
                      content: {
                        text: "Build websites in less time with elements for??every use case.",
                      },
                    },
                    design: {
                      typography: {
                        color: {
                          breakpoint_base: "var(--bd-palette-color-10)",
                        },
                        typography: {
                          preset:
                            "preset-id-840408c0-dc3b-432e-80bf-aa6361f929b3",
                          previousCustom: {
                            customTypography: [],
                          },
                        },
                      },
                    },
                  },
                },
                children: [],
                _parentId: 568,
              },
            ],
            _parentId: 567,
          },
          {
            id: 572,
            data: {
              type: "EssentialElements\\Column",
              properties: {
                design: {
                  size: {
                    width: {
                      unit: "%",
                      number: 75,
                      style: "75%",
                    },
                  },
                  layout: {
                    horizontal: {
                      align: {
                        breakpoint_base: "flex-start",
                      },
                      vertical_align: {
                        breakpoint_base: "center",
                      },
                    },
                    gap: {
                      breakpoint_base: {
                        number: 20,
                        unit: "px",
                        style: "20px",
                      },
                    },
                  },
                },
                settings: {
                  advanced: {
                    wrapper: {
                      layout: {
                        display: {
                          breakpoint_base: "flex",
                        },
                        flex_wrap: {
                          breakpoint_base: "wrap",
                        },
                      },
                    },
                  },
                },
              },
            },
            children: [
              {
                id: 573,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 574,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 573,
                  },
                  {
                    id: 575,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 573,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 576,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 577,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 576,
                  },
                  {
                    id: 578,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 576,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 579,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 580,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 579,
                  },
                  {
                    id: 581,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 579,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 582,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 583,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 582,
                  },
                  {
                    id: 584,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 582,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 585,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 586,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 585,
                  },
                  {
                    id: 587,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 585,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 588,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 589,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 588,
                  },
                  {
                    id: 590,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 588,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 591,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 592,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 591,
                  },
                  {
                    id: 593,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 591,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 594,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 595,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 594,
                  },
                  {
                    id: 596,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 594,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 597,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 598,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 597,
                  },
                  {
                    id: 599,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 597,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 600,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 601,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 600,
                  },
                  {
                    id: 602,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 600,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 603,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 604,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 603,
                  },
                  {
                    id: 605,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 603,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 606,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 607,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 606,
                  },
                  {
                    id: 608,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 606,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 609,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 610,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 609,
                  },
                  {
                    id: 611,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 609,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 612,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 613,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 612,
                  },
                  {
                    id: 614,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 612,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 615,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 616,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 615,
                  },
                  {
                    id: 617,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 615,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 618,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 619,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 618,
                  },
                  {
                    id: 620,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 618,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 621,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 622,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 621,
                  },
                  {
                    id: 623,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 621,
                  },
                ],
                _parentId: 572,
              },
              {
                id: 624,
                data: {
                  type: "EssentialElements\\Div",
                  properties: {
                    settings: {
                      advanced: {
                        wrapper: {
                          spacing: {
                            padding: {
                              breakpoint_base: {
                                left: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                right: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                top: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                                bottom: {
                                  number: 20,
                                  unit: "px",
                                  style: "20px",
                                },
                              },
                            },
                          },
                          borders: {
                            border: {
                              breakpoint_base: {
                                top: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                bottom: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                left: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                                right: {
                                  width: {
                                    number: 1,
                                    unit: "px",
                                    style: "1px",
                                  },
                                  color: "var(--bd-palette-color-7)",
                                  style: "solid",
                                },
                              },
                            },
                            radius: {
                              breakpoint_base: {
                                all: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                topRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomLeft: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                bottomRight: {
                                  number: 4,
                                  unit: "px",
                                  style: "4px",
                                },
                                editMode: "all",
                              },
                            },
                          },
                        },
                      },
                    },
                    design: {
                      layout: {
                        align: {
                          breakpoint_base: "center",
                        },
                        vertical_align: {
                          breakpoint_base: "center",
                        },
                        gap: {
                          breakpoint_base: {
                            number: 8,
                            unit: "px",
                            style: "8px",
                          },
                        },
                      },
                    },
                  },
                },
                children: [
                  {
                    id: 625,
                    data: {
                      type: "EssentialElements\\Icon",
                      properties: {
                        content: {
                          content: {
                            icon: {
                              slug: "icon-elementicon.",
                              name: "elementicon",
                              svgCode:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">\n<path d="M27.6875 0.125C28.4688 0.125 29.1328 0.398438 29.6797 0.945312C30.2266 1.49219 30.5 2.15625 30.5 2.9375V23.5625C30.5 24.3438 30.2266 25.0078 29.6797 25.5547C29.1328 26.1016 28.4688 26.375 27.6875 26.375H3.3125C2.53125 26.375 1.86719 26.1016 1.32031 25.5547C0.773438 25.0078 0.5 24.3438 0.5 23.5625V2.9375C0.5 2.15625 0.773438 1.49219 1.32031 0.945312C1.86719 0.398438 2.53125 0.125 3.3125 0.125H27.6875ZM12.043 2.46875V8.09375H18.957V2.46875H12.043ZM12.043 10.4375V16.0625H18.957V10.4375H12.043ZM9.69922 24.0312V18.4062H2.84375V23.3281C2.84375 23.7969 3.07812 24.0312 3.54688 24.0312H9.69922ZM9.69922 16.0625V10.4375H2.84375V16.0625H9.69922ZM9.69922 8.09375V2.46875H3.54688C3.07812 2.46875 2.84375 2.70312 2.84375 3.17188V8.09375H9.69922ZM18.957 24.0312V18.4062H12.043V24.0312H18.957ZM28.1562 24.0312V18.4062H21.3008V24.0312H28.1562ZM28.1562 16.0625V10.4375H21.3008V16.0625H28.1562ZM28.1562 8.09375V2.46875H21.3008V8.09375H28.1562Z" fill="black"/>\n</svg>',
                            },
                          },
                        },
                        design: {
                          icon: {
                            size: {
                              breakpoint_base: {
                                number: 28,
                                unit: "px",
                                style: "28px",
                              },
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 624,
                  },
                  {
                    id: 626,
                    data: {
                      type: "EssentialElements\\Text",
                      properties: {
                        content: {
                          content: {
                            text: "Element",
                          },
                        },
                        design: {
                          typography: {
                            typography: {
                              preset:
                                "preset-id-fb824108-3367-421a-a7dd-86a6a827bef0",
                              previousCustom: {
                                customTypography: [],
                              },
                            },
                            color: {
                              breakpoint_base: "var(--bd-palette-color-16)",
                            },
                          },
                        },
                      },
                    },
                    children: [],
                    _parentId: 624,
                  },
                ],
                _parentId: 572,
              },
            ],
            _parentId: 567,
          },
        ],
      },
    ],
  },

  {
    title: "Real-world data issue #2",
    left: [
      {
        id: 101,
        data: {
          type: "EssentialElements\\Heading",
          properties: {
            content: { content: { text: "This is a heading." } },
            design: {
              spacing: {
                margin_top: {
                  breakpoint_base: { number: 20, unit: "px", style: "20px" },
                },
              },
            },
          },
        },
        children: [],
        _parentId: 110,
      },
    ],
    right: [],
    expected: [
      {
        op: "replace",
        path: "",
        value: [],
      },
    ],
  },
];

export const allCases: DiffTestCase[] = [
  ...objectCases,
  ...singleDimensionalArrayOfPrimitivesCases,
  ...arrayCasesInsideObjectProperty,
  ...arrayCasesInsideNestedObjectProperty,
  ...thirdPartyCases,
  ...multiDimensionalArrayCases,
  ...otherCasesInsideMultidimensionalArrays,
  ...realWorldLargeDocumentCases,
];
