/**
 * Test Types for Vitest Custom Matchers
 */

import type { Assertion } from 'vitest';

export interface TestingLibraryMatchers<T = typeof expect> extends Omit<Assertion<T>, 'toBeInTheDocument' | 'toHaveClass' | 'toBeDisabled' | 'toHaveValue' | 'toHaveAttribute' | 'toHaveFocus'> {
  toBeInTheDocument(): T;
  toHaveClass(className: string): T;
  toBeDisabled(): T;
  toHaveValue(value: string | number | readonly string[]): T;
  toHaveAttribute(attr: string, value?: string): T;
  toHaveFocus(): T;
}

declare module 'vitest' {
  interface Assertion<T = any> extends TestingLibraryMatchers<T> {}
  interface AsymmetricAssertions extends TestingLibraryMatchers {}
}
