// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session, User as AuthUser } from 'lucia';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: AuthUser | null;
			session: Session | null;
		}
	}
}
