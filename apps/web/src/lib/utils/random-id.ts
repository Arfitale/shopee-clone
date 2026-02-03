import { randomBytes } from 'crypto';

export type RandomIdOptions = {
	length?: number;
	alphabet?: string;
	prefix?: string;
	suffix?: string;
	groupSize?: number;
	separator?: string;
};

const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const DEFAULTS: Required<Omit<RandomIdOptions, 'groupSize' | 'separator'>> & {
	groupSize?: number;
	separator?: string;
} = {
	length: 12,
	alphabet: DEFAULT_ALPHABET,
	prefix: '',
	suffix: '',
	groupSize: undefined,
	separator: '-'
};

export function randomId(options: RandomIdOptions = {}): string {
	const opts = { ...DEFAULTS, ...options };

	if (opts.length <= 0) {
		throw new Error('randomId: length must be greater than 0');
	}

	if (!opts.alphabet || opts.alphabet.length < 2) {
		throw new Error('randomId: alphabet must contain at least 2 characters');
	}

	const id = generateRandomString(opts.length, opts.alphabet);
	const grouped =
		opts.groupSize && opts.groupSize > 0
			? groupString(id, opts.groupSize, opts.separator ?? DEFAULTS.separator!)
			: id;

	return `${opts.prefix}${grouped}${opts.suffix}`;
}

function generateRandomString(length: number, alphabet: string): string {
	const mask = alphabet.length - 1;
	const isPowerOfTwo = (alphabet.length & mask) === 0;

	if (isPowerOfTwo) {
		const bytes = randomBytes(length);
		let out = '';
		for (let i = 0; i < length; i += 1) {
			out += alphabet[bytes[i]! & mask];
		}
		return out;
	}

	let out = '';
	while (out.length < length) {
		const bytes = randomBytes(length);
		for (let i = 0; i < bytes.length && out.length < length; i += 1) {
			const idx = bytes[i]! % alphabet.length;
			out += alphabet[idx];
		}
	}
	return out;
}

function groupString(value: string, size: number, separator: string): string {
	let out = '';
	for (let i = 0; i < value.length; i += size) {
		if (i > 0) out += separator;
		out += value.slice(i, i + size);
	}
	return out;
}
