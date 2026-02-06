<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { LayoutDashboard, Package, ShoppingBag, CirclePlus, Menu } from '@lucide/svelte';
	import { page } from '$app/state';

	let { data, children } = $props();

	const isActive = $derived((path: string) => {
		return page.url.pathname === path;
	});

	let mobileMenuOpen = $state(false);

	const navItems = [
		{
			href: '/seller',
			label: 'Dashboard',
			icon: LayoutDashboard
		},
		{
			href: '/seller/products',
			label: 'Products',
			icon: Package
		},
		{
			href: '/seller/orders',
			label: 'Orders',
			icon: ShoppingBag,
			badge: () => data?.stats?.orderItemCount
		},
		{
			href: '/seller/products/new',
			label: 'Add Product',
			icon: CirclePlus
		}
	];
</script>

<div class="min-h-screen bg-muted/40">
	<!-- Top Header -->
	<header
		class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
	>
		<div class="flex h-16 items-center gap-4 px-4 sm:px-6">
			<!-- Mobile Menu Toggle -->
			<button onclick={() => (mobileMenuOpen = !mobileMenuOpen)} class="lg:hidden">
				<Menu class="h-6 w-6" />
			</button>

			<!-- Logo/Brand -->
			<div class="flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
				>
					<ShoppingBag class="h-5 w-5" />
				</div>
				<div class="hidden sm:block">
					<h1 class="text-lg font-bold">Seller Dashboard</h1>
					<p class="text-xs text-muted-foreground">Manage your store</p>
				</div>
			</div>
		</div>
	</header>

	<div class="relative flex min-h-[calc(100vh-4rem)]">
		<aside
			class="sticky top-16 left-0 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background lg:flex"
		>
			<div class="overflow-auto p-4">
				<!-- Seller Info -->
				{#if data?.seller}
					<div class="mb-6 rounded-lg border bg-muted/50 p-4">
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
							>
								{data.seller.name?.charAt(0) || data.seller.email.charAt(0)}
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate font-semibold">{data.seller.name || 'Seller'}</p>
								<p class="truncate text-xs text-muted-foreground">{data.seller.email}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Navigation -->
				<nav class="space-y-1">
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
								item.href
							)
								? 'bg-accent font-medium text-accent-foreground'
								: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}"
						>
							<item.icon />
							{item.label}
							{#if item.badge}
								<Badge variant="destructive" class="ml-auto">
									{item.badge()}
								</Badge>
							{/if}
						</a>
					{/each}
				</nav>
			</div>

			<!-- Sidebar Footer -->
			<div class="border-t p-4">
				<Button variant="outline" class="w-full gap-2" href="/">
					<LayoutDashboard class="h-4 w-4" />
					Back to Store
				</Button>
			</div>
		</aside>
		<!-- Mobile Sidebar Overlay -->
		{#if mobileMenuOpen}
			<button
				type="button"
				class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
				onclick={() => (mobileMenuOpen = false)}
				onkeydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
				aria-label="Close mobile menu"
			>
				<aside class="fixed top-16 bottom-0 left-0 w-64 border-r bg-background p-4">
					<nav class="space-y-1">
						{#each navItems as item}
							<a
								href={item.href}
								class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
									item.href
								)
									? 'bg-accent font-medium text-accent-foreground'
									: 'text-muted-foreground hover:bg-accent/50'}"
								onclick={() => (mobileMenuOpen = false)}
							>
								<item.icon class="h-5 w-5" />
								{item.label}
								{#if item.badge}
									<Badge variant="destructive" class="ml-auto">
										{item.badge}
									</Badge>
								{/if}
							</a>
						{/each}
					</nav>
				</aside>
			</button>
		{/if}
		<main class="w-full">
			{@render children()}
		</main>
	</div>
</div>
