// Source: https://github.com/cchanxzy/react-currency-input-field
export const isNumber = (input: string): boolean =>
  RegExp(/\d/, "gi").test(input);
