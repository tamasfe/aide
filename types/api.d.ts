export type ValidationError<T = Record<string, unknown>> = {
  code: string;
  message: string;
  metadata: T;
};
