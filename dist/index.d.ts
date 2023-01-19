declare type BaseOperation = {
    path: string;
};
declare type AddOperation<T = unknown> = BaseOperation & {
    op: "add";
    value: T;
};
declare type RemoveOperation = BaseOperation & {
    op: "remove";
};
declare type ReplaceOperation<T = unknown> = BaseOperation & {
    op: "replace";
    value: T;
};
declare type MoveOperation = BaseOperation & {
    op: "move";
    from: string;
};
declare type CopyOperation = BaseOperation & {
    op: "copy";
    from: string;
};
declare type TestOperation<T = unknown> = BaseOperation & {
    op: "test";
    value: T;
};
declare type Operation<T = unknown> = AddOperation<T> | RemoveOperation | ReplaceOperation<T> | MoveOperation | CopyOperation | TestOperation<T>;

type rfc6902_AddOperation<T = unknown> = AddOperation<T>;
type rfc6902_RemoveOperation = RemoveOperation;
type rfc6902_ReplaceOperation<T = unknown> = ReplaceOperation<T>;
type rfc6902_MoveOperation = MoveOperation;
type rfc6902_CopyOperation = CopyOperation;
type rfc6902_TestOperation<T = unknown> = TestOperation<T>;
type rfc6902_Operation<T = unknown> = Operation<T>;
declare namespace rfc6902 {
  export {
    rfc6902_AddOperation as AddOperation,
    rfc6902_RemoveOperation as RemoveOperation,
    rfc6902_ReplaceOperation as ReplaceOperation,
    rfc6902_MoveOperation as MoveOperation,
    rfc6902_CopyOperation as CopyOperation,
    rfc6902_TestOperation as TestOperation,
    rfc6902_Operation as Operation,
  };
}

declare type ComparableRecord = Record<string | number, unknown>;
declare type ComparableArray = Array<unknown>;
declare type ComparableValue = ComparableRecord | ComparableArray;
declare type CompareOptions = {
    detectMoveOperations?: boolean;
    doCaching?: boolean;
};
declare type CompareFunc = (ia: unknown, ib: unknown) => boolean;

declare function compare(left: ComparableValue, right: ComparableValue, options?: CompareOptions): Operation[];

declare function diffUnknownValues(leftVal: unknown, rightVal: unknown, compareFunc: CompareFunc, path?: string, rightValExists?: boolean, operations?: Operation[], detectMoveOperations?: boolean): Operation[];

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
declare function diffObjects(leftObj: ComparableRecord, rightObj: ComparableRecord, compareFunc: CompareFunc, path?: string, operations?: Operation[]): Operation[];

declare function diffArrays(leftArr: Array<unknown>, rightArr: Array<unknown>, compareFunc: CompareFunc, path?: string, operations?: Operation[], detectMoveOperations?: boolean): Operation[];

declare function diffArraysUsingLcs(leftArr: ComparableArray, rightArr: ComparableArray, compareFunc: CompareFunc, path?: string, operations?: Operation[], detectMoveOperations?: boolean): Operation[];
declare function getLcsBasedOperations<T>(leftArr: T[], rightArr: T[], compareFunc: CompareFunc, path: string, outputOperations?: Operation[], shouldDetectMoveOperations?: boolean): Operation[];

export { ComparableArray, ComparableRecord, ComparableValue, CompareFunc, CompareOptions, rfc6902 as RFC6902, compare, diffArrays, diffArraysUsingLcs, diffObjects, diffUnknownValues, getLcsBasedOperations };
