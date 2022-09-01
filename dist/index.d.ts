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

declare function normalizePathComponent(path: string): string;
declare function appendToPath(path: string, key: number | string): string;

declare function compare(left: ComparableValue, right: ComparableValue): Operation[];

declare function diffUnknownValues(leftVal: unknown, rightVal: unknown, path?: string, rightValExists?: boolean): Operation[];

declare function diffObjects(leftObj: ComparableRecord, rightObj: ComparableRecord, path?: string): Operation[];

declare function diffArrays(leftArr: Array<unknown>, rightArr: Array<unknown>, path?: string): Operation[];

declare function diffArraysUsingLcs(leftArr: ComparableArray, rightArr: ComparableArray, path?: string): Operation[];
declare function getLcsBasedOperations<T>(a: T[], b: T[], compareFunc: ((ia: T, ib: T) => boolean) | undefined, path: string): Operation[];

export { ComparableArray, ComparableRecord, ComparableValue, rfc6902 as RFC6902, appendToPath, compare, diffArrays, diffArraysUsingLcs, diffObjects, diffUnknownValues, getLcsBasedOperations, normalizePathComponent };
