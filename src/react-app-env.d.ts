/// <reference types="react-scripts" />

type PromiseType<T> = (...args: any[]) => Promise<T>;
type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;