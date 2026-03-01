import '@testing-library/jest-dom/vitest';
import '@testing-library/svelte/vitest';

if (typeof globalThis.crypto?.randomUUID !== 'function') {
	globalThis.crypto = {
		...globalThis.crypto,
		randomUUID: () =>
			'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
				const r = (Math.random() * 16) | 0;
				return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
			}) as `${string}-${string}-${string}-${string}-${string}`
	};
}
