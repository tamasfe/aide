export type Breakpoints = "sm" | "md" | "lg" | "xl";
export type BreakpointValues = Record<Breakpoints, number>;

export type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type PiniaStore<T extends (...args: never[]) => unknown> = Omit<
  ReturnType<T>,
  keyof ReturnType<typeof defineStore>
>;

export type Keyified<T> = T & { key: string };
