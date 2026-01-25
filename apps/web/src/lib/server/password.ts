import { hash, verify } from '@node-rs/argon2';

export function hashPassword(password: string) {
	return hash(password);
}

export function verifyPassword(hash: string, password: string) {
	return verify(hash, password);
}
