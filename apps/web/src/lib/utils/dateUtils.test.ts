import { describe, it, expect } from 'vitest';
import { isValidDate } from './dateUtils';

describe('isValidDate', () => {
	it('accepts a valid ISO date', () => {
		expect(isValidDate('2026-01-15')).toBe(true);
	});

	it('accepts leap day on a leap year', () => {
		expect(isValidDate('2024-02-29')).toBe(true);
	});

	it('rejects leap day on a non-leap year', () => {
		expect(isValidDate('2026-02-29')).toBe(false);
	});

	it('rejects empty string', () => {
		expect(isValidDate('')).toBe(false);
	});

	it('rejects non-date strings', () => {
		expect(isValidDate('hello')).toBe(false);
		expect(isValidDate('not-a-date')).toBe(false);
	});

	it('rejects invalid calendar dates', () => {
		expect(isValidDate('2026-02-30')).toBe(false);
		expect(isValidDate('2026-13-01')).toBe(false);
		expect(isValidDate('2026-00-01')).toBe(false);
	});

	it('rejects wrong format (missing zero-padding)', () => {
		expect(isValidDate('2026-1-15')).toBe(false);
		expect(isValidDate('2026-01-5')).toBe(false);
	});

	it('rejects dates with extra characters', () => {
		expect(isValidDate('2026-01-15T00:00')).toBe(false);
		expect(isValidDate(' 2026-01-15')).toBe(false);
	});

	it('accepts boundary dates', () => {
		expect(isValidDate('2026-01-01')).toBe(true);
		expect(isValidDate('2026-12-31')).toBe(true);
	});
});
