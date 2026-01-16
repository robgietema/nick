import { describe, it, expect } from 'vitest';
import { formatSize, formatAttribute } from './format';

describe('Format', () => {
  it('should format size for bytes', () =>
    expect(formatSize(124)).toBe('124 B'));

  it('should format size for kilo bytes', () =>
    expect(formatSize(2000)).toBe('2 KB'));

  it('should format an attribute', () =>
    expect(formatAttribute('test')).toBe('"test"'));

  it('should format an attribute with dotted name', () =>
    expect(formatAttribute('test.test')).toBe('"test"."test"'));

  it('should format an attribute with json attribute', () =>
    expect(formatAttribute('test->>"test"')).toBe('test->>"test"'));

  it('should format an attribute with a function', () =>
    expect(formatAttribute('test->>"test"')).toBe('test->>"test"'));
});
