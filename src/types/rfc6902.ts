export namespace RFC6902 {
  type BaseOperation = {
    path: string;
  };

  export type AddOperation<T = any> = BaseOperation & {
    op: "add";
    value: T;
  };

  export type RemoveOperation = BaseOperation & {
    op: "remove";
  };

  export type ReplaceOperation<T = any> = BaseOperation & {
    op: "replace";
    value: T;
  };

  export type MoveOperation = BaseOperation & {
    op: "move";
    from: string;
  };

  export type CopyOperation = BaseOperation & {
    op: "copy";
    from: string;
  };

  export type TestOperation<T = any> = BaseOperation & {
    op: "test";
    value: T;
  };

  export type Operation<T = any> =
    | AddOperation<T>
    | RemoveOperation
    | ReplaceOperation<T>
    | MoveOperation
    | CopyOperation
    | TestOperation<T>;
}
