export type Breakpoints = "sm" | "md" | "lg" | "xl";
export type BreakpointValues = Record<Breakpoints, number>;

export type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
