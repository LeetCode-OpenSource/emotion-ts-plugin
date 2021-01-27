declare namespace jest {
  interface Matchers<R> {
    toMatchSpecificSnapshot: (snapshotPath: string) => R
  }
}

declare module 'jest-specific-snapshot'

declare module 'my-emotion'
