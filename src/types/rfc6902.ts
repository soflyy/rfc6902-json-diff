type BaseOperation = {
  path: string;
};

export type AddOperation<T = unknown> = BaseOperation & {
  op: "add";
  value: T;
};

export type RemoveOperation = BaseOperation & {
  op: "remove";
};

export type ReplaceOperation<T = unknown> = BaseOperation & {
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

export type TestOperation<T = unknown> = BaseOperation & {
  op: "test";
  value: T;
};

export type Operation<T = unknown> =
  | AddOperation<T>
  | RemoveOperation
  | ReplaceOperation<T>
  | MoveOperation
  | CopyOperation
  | TestOperation<T>;
