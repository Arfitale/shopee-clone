import type { User as DBUser } from '$lib/db';

type UserProfile = Omit<DBUser, 'passwordHash' | 'createdAt'>;
