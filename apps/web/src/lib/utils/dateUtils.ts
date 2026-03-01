/**
 * Validates that a string is a valid ISO date (YYYY-MM-DD) representing a real calendar date.
 */
export function isValidDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const d = new Date(value + 'T00:00:00Z');
	return !isNaN(d.getTime()) && d.toISOString().startsWith(value);
}
