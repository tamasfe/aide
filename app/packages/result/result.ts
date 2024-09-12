import type { CustomError } from "./custom-error";

export type FailureResult<E extends CustomError> = {
  isFailure: true;
  error: E;
};

export type SuccessResult<V> = {
  isFailure: false;
  value: V;
};
export type EmptySuccessResult = {
  isFailure: false;
};

/**
 * @example
 *
 * class DivideByZeroError extends CustomError {
 *   constructor() { super({ message: 'Cannot divide by zero' }) }
 * }
 * class BadLuckNumberError extends CustomError {
 *   constructor() { super({ message: 'Bad luck number' }) }
 * }
 *
 * type DivideErrors = DivideByZeroError | BadLuckNumberError;
 *
 * function divide(a: number, b: number): Result<number, DivideErrors> {
 *   if (b === 0) {
 *     return fail(new DivideByZeroError());
 *   }
 *   if (a === 13 || b === 13) {
 *     return fail(new BadLuckNumberError());
 *   }
 *   return success(a / b);
 * }
 *
 * const result = divide(13, 0);
 *
 * if (result.isFailure) {
 *   if (result.error instanceof DivideByZeroError) {
 *     console.log('Cannot divide by zero');
 *   } else if (result.error instanceof BadLuckNumberError) {
 *     console.log('Bad luck number');
 *   } else {
 *     result.error
 *     //     ^^^^^-- never
 *   }
 * } else {
 *   console.log(result.value);
 *   //          ^^^^^^-- number
 * }
 */
export type Result<V, E extends CustomError> =
  | FailureResult<E>
  | SuccessResult<V>;
export type EmptyResult<E extends CustomError> =
  | FailureResult<E>
  | EmptySuccessResult;

export function success(): EmptySuccessResult;
export function success<V>(value: V): SuccessResult<V>;
export function success<V>(value?: V): EmptySuccessResult | SuccessResult<V> {
  if (typeof value === "undefined") return { isFailure: false };
  return { isFailure: false, value };
}

export function fail<E extends CustomError>(error: E): FailureResult<E> {
  return { isFailure: true, error };
}

// --- Utility types --- //

/**
 * @example
 *
 * interface ErrorA extends CustomError {}
 * interface ErrorB extends CustomError {}
 * type SomeFunctionReturn = Result<string, ErrorA | ErrorB>;
 *
 * type FunctionErrors = ResultError<SomeFunctionReturn>;
 * //   ^^^^^^^^^^^^^^-- ErrorA | ErrorB
 */
export type ResultError<R extends Result<unknown, CustomError>> =
  R extends Result<unknown, infer E> ? E : never;

/**
 * @example
 *
 * interface ErrorA extends CustomError {}
 * interface ErrorB extends CustomError {}
 * type SomeFunctionReturn = Result<string, ErrorA | ErrorB>;
 *
 * type FunctionErrors = ResultValue<SomeFunctionReturn>;
 * //   ^^^^^^^^^^^^^^-- string
 */
export type ResultValue<R extends Result<unknown, CustomError>> =
  R extends SuccessResult<infer V> ? V : never;

// --- Utility functions --- //

/**
 * This function should not be used in production code, it's only for testing purposes.
 *
 * @example
 *
 * const result: Result<number, any> = success(1);
 * const value = unfold(result);
 * //    ^^^^^-- number
 *
 * @example
 *
 * const result: Result<number, any> = fail(new CustomError({message: 'error'}));
 * const value = unfold(result);
 * //    ^^^^^-- never
 */
export function unfold<R extends Result<unknown, CustomError>>(
  result: R,
): ResultValue<R> {
  if (result.isFailure) throw result.error;
  return result.value as ResultValue<R>;
}
