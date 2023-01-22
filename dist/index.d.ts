type BaseOperation = {
    path: string;
};
type AddOperation<T = unknown> = BaseOperation & {
    op: "add";
    value: T;
};
type RemoveOperation = BaseOperation & {
    op: "remove";
};
type ReplaceOperation<T = unknown> = BaseOperation & {
    op: "replace";
    value: T;
};
type MoveOperation = BaseOperation & {
    op: "move";
    from: string;
};
type CopyOperation = BaseOperation & {
    op: "copy";
    from: string;
};
type TestOperation<T = unknown> = BaseOperation & {
    op: "test";
    value: T;
};
type Operation<T = unknown> = AddOperation<T> | RemoveOperation | ReplaceOperation<T> | MoveOperation | CopyOperation | TestOperation<T>;

type rfc6902_AddOperation<T = unknown> = AddOperation<T>;
type rfc6902_CopyOperation = CopyOperation;
type rfc6902_MoveOperation = MoveOperation;
type rfc6902_Operation<T = unknown> = Operation<T>;
type rfc6902_RemoveOperation = RemoveOperation;
type rfc6902_ReplaceOperation<T = unknown> = ReplaceOperation<T>;
type rfc6902_TestOperation<T = unknown> = TestOperation<T>;
declare namespace rfc6902 {
  export {
    rfc6902_AddOperation as AddOperation,
    rfc6902_CopyOperation as CopyOperation,
    rfc6902_MoveOperation as MoveOperation,
    rfc6902_Operation as Operation,
    rfc6902_RemoveOperation as RemoveOperation,
    rfc6902_ReplaceOperation as ReplaceOperation,
    rfc6902_TestOperation as TestOperation,
  };
}

type ComparableRecord = Record<string | number, unknown>;
type ComparableArray = Array<unknown>;
type ComparableValue = ComparableRecord | ComparableArray;
type CompareOptions = {
    detectMoveOperations?: boolean;
    doCaching?: boolean;
};
type CompareFunc = (ia: unknown, ib: unknown) => boolean;

declare function compare(left: ComparableValue, right: ComparableValue, options?: CompareOptions): Operation[];

declare function diffUnknownValues(leftVal: unknown, rightVal: unknown, compareFunc: CompareFunc, path?: string, rightValExists?: boolean, operations?: Operation[], detectMoveOperations?: boolean): void;

declare function diffObjects(leftObj: ComparableRecord, rightObj: ComparableRecord, compareFunc: CompareFunc, path?: string, operations?: Operation[]): void;

declare function diffArrays(leftArr: Array<unknown>, rightArr: Array<unknown>, compareFunc: CompareFunc, path?: string, operations?: Operation[], detectMoveOperations?: boolean): void;

declare function diffArraysUsingLcs(leftArr: ComparableArray, rightArr: ComparableArray, compareFunc: CompareFunc, path?: string, operations?: Operation[], shouldDetectMoveOperations?: boolean): void;

export { ComparableArray, ComparableRecord, ComparableValue, CompareFunc, CompareOptions, rfc6902 as RFC6902, compare, diffArrays, diffArraysUsingLcs, diffObjects, diffUnknownValues };
