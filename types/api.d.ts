export type ApiData<T> = {
  data: T;
};

export type ValidationError<T = Record<string, unknown>> = {
  code: string;
  message: string;
  metadata: ValidationErrorMetadata<T>;
};

export type ValidationErrorMetadata<T = Record<string, unknown>> = {
  [key: string]: Metadata<T>[];
};

export type Metadata<T = Record<string, unknown>> = {
  code: string;
  message: string;
  params: T;
};
