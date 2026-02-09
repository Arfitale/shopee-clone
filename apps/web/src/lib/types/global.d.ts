import type { User as DBUser } from '$lib/db';
import type { ActionResult } from '@sveltejs/kit';

type UserProfile = Omit<DBUser, 'passwordHash' | 'createdAt'>;
type FormActionResult = ActionResult<{
	success: boolean;
	message: string;
	[key: string]: unknown; // allows any additional properties
}>;
