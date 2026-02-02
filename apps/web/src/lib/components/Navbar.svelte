<script lang="ts">
	import { page } from '$app/state';
	import Button from './ui/button/button.svelte';
</script>

<header class="border-b bg-background">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<h1 class="text-xl font-bold tracking-tight">Shopee Clone</h1>
		<nav class="flex items-center gap-3">
			<Button variant="ghost" size="sm">
				<a href="/">Home</a>
			</Button>
			<Button variant="ghost" size="sm">
				<a href="/products">Products</a>
			</Button>
			{#if page.data.user}
				<Button variant="ghost" size="sm">
					<a href="/cart">Cart</a>
				</Button>
				<Button variant="ghost" size="sm">
					<a href="/orders">Orders</a>
				</Button>
				{#if page.data.user.role === 'SELLER'}
					<Button variant="ghost" size="sm">
						<a href="/seller/orders">Seller</a>
					</Button>
				{/if}
				<Button size="sm" variant="outline">
					<a href="/auth/logout">Logout</a>
				</Button>
			{:else}
				<Button size="sm" variant="outline">
					<a href="/login">Login</a>
				</Button>
				<Button size="sm">
					<a href="/register">Register</a>
				</Button>
			{/if}
		</nav>
	</div>
</header>
