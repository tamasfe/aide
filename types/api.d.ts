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
