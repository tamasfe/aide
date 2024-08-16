export type ValidationError<T = Record<string, unknown>> = {
  code: string;
  message: string;
  metadata: ValidationErrorMetadata<T>;
};

export type Metadata<T = Record<string, unknown>> = {
  code: string;
  message: string;
  params: T;
};

export type ValidationErrorMetadata<T = Record<string, unknown>> = {
  [key: string]: Metadata<T>[];
};

export type GameImageVariant =
  | "small"
  | "medium"
  | "large"
  | "extra_large"
  | "background";

// temp until we generate the types which is getting fixed
// as of moment I'm writing this
export type Game = {
  id: number;
  ext_id: string;
  name: string;
};

export type ApiData<T> = {
  data: T;
};
