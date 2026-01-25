<script lang="ts">
	import { page } from '$app/state';
	const user = page.data.user;
</script>

<h1>Welcome to Shopee</h1>

{#if !user}
	<a href="/login">Sign In</a>
	<a href="/register">Sign Up</a>
{:else}
	<p>Hello, {user.email}!</p>
	<a href="/auth/logout">Sign out</a>
{/if}
