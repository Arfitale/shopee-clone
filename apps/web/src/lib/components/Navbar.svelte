<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { ShoppingCart, User, Menu, Package, Store, House, LogOut } from '@lucide/svelte';
	import Logo from './Logo.svelte';
	import ModeWatcherToggler from './ModeWatcherToggler.svelte';
	import { mode } from 'mode-watcher';

	// Get current path for active state
	const isActive = $derived((path: string) => {
		return page.url.pathname === path || page.url.pathname.startsWith(path + '/');
	});

	// Cart item count (you can pass this from your data)
	const cartItemCount = $derived(page.data.cartItemCount ?? 0);

	let mobileMenuOpen = $state(false);
</script>

{#if !page.data.hideMainNav}
	<header
		class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
	>
		<div class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
			<!-- Logo -->
			<Logo />

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-1 md:flex">
				<Button
					variant={isActive('/') && !isActive('/products') ? 'secondary' : 'ghost'}
					size="sm"
					href="/"
					class="gap-2"
				>
					<House class="h-4 w-4" />
					Home
				</Button>

				<Button
					variant={isActive('/products') ? 'secondary' : 'ghost'}
					size="sm"
					href="/products"
					class="gap-2"
				>
					<Package class="h-4 w-4" />
					Products
				</Button>

				{#if page.data.user}
					<!-- Cart with Badge -->
					<Button
						variant={isActive('/cart') ? 'secondary' : 'ghost'}
						size="sm"
						href="/cart"
						class="relative gap-2"
					>
						<ShoppingCart class="h-4 w-4" />
						Cart
						{#if cartItemCount > 0}
							<Badge
								variant="destructive"
								class="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
							>
								{cartItemCount}
							</Badge>
						{/if}
					</Button>

					<Button
						variant={isActive('/orders') ? 'secondary' : 'ghost'}
						size="sm"
						href="/orders"
						class="gap-2"
					>
						<Package class="h-4 w-4" />
						Orders
					</Button>

					{#if page.data.user.role === 'SELLER'}
						<Button
							variant={isActive('/seller') ? 'secondary' : 'ghost'}
							size="sm"
							href="/seller/orders"
							class="gap-2"
						>
							<Store class="h-4 w-4" />
							Seller
						</Button>
					{/if}

					<ModeWatcherToggler />

					<!-- User Dropdown -->
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost" size="sm" class="gap-2">
								<User class="h-4 w-4" />
								<span class="max-w-25 truncate">
									{page.data.user.name}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" class="w-56">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<a href="/orders">
								<DropdownMenuItem>
									<Package class="mr-2 h-4 w-4" />
									My Orders
								</DropdownMenuItem>
							</a>
							{#if page.data.user.role === 'SELLER'}
								<a href="/seller">
									<DropdownMenuItem>
										<Store class="mr-2 h-4 w-4" />
										Seller Dashboard
									</DropdownMenuItem>
								</a>
							{/if}
							<DropdownMenuSeparator />
							<a href="/auth/logout">
								<DropdownMenuItem class="text-destructive">
									<LogOut class="mr-2 h-4 w-4" />
									Logout
								</DropdownMenuItem>
							</a>
						</DropdownMenuContent>
					</DropdownMenu>
				{:else}
					<Button size="sm" variant="ghost" href="/login">Login</Button>
					<Button size="sm" href="/register">Register</Button>
				{/if}
			</nav>

			<!-- Mobile Menu -->
			<div class="flex items-center gap-2 md:hidden">
				{#if page.data.user}
					<!-- Mobile Cart Button -->
					<Button variant="ghost" size="icon" href="/cart" class="relative">
						<ShoppingCart class="h-5 w-5" />
						{#if cartItemCount > 0}
							<Badge
								variant="destructive"
								class="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
							>
								{cartItemCount}
							</Badge>
						{/if}
					</Button>
				{/if}

				<Sheet bind:open={mobileMenuOpen}>
					<SheetTrigger>
						<Button variant="ghost" size="icon">
							<Menu class="h-5 w-5" />
							<span class="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" class="w-75 sm:w-100">
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>
						<nav class="mt-6 flex flex-col gap-2">
							<Button
								variant={isActive('/') && !isActive('/products') ? 'secondary' : 'ghost'}
								href="/"
								class="justify-start gap-2"
								onclick={() => (mobileMenuOpen = false)}
							>
								<House class="h-4 w-4" />
								Home
							</Button>

							<Button
								variant={isActive('/products') ? 'secondary' : 'ghost'}
								href="/products"
								class="justify-start gap-2"
								onclick={() => (mobileMenuOpen = false)}
							>
								<Package class="h-4 w-4" />
								Products
							</Button>

							{#if page.data.user}
								<Button
									variant={isActive('/cart') ? 'secondary' : 'ghost'}
									href="/cart"
									class="justify-start gap-2"
									onclick={() => (mobileMenuOpen = false)}
								>
									<ShoppingCart class="h-4 w-4" />
									Cart
									{#if cartItemCount > 0}
										<Badge variant="secondary" class="ml-auto">
											{cartItemCount}
										</Badge>
									{/if}
								</Button>

								<Button
									variant={isActive('/orders') ? 'secondary' : 'ghost'}
									href="/orders"
									class="justify-start gap-2"
									onclick={() => (mobileMenuOpen = false)}
								>
									<Package class="h-4 w-4" />
									Orders
								</Button>

								{#if page.data.user.role === 'SELLER'}
									<Button
										variant={isActive('/seller') ? 'secondary' : 'ghost'}
										href="/seller/orders"
										class="justify-start gap-2"
										onclick={() => (mobileMenuOpen = false)}
									>
										<Store class="h-4 w-4" />
										Seller Dashboard
									</Button>
								{/if}

								<div class="my-4 border-t"></div>

								<div class="px-3 py-2">
									<p class="text-sm font-medium">Signed in as</p>
									<p class="text-sm text-muted-foreground">
										{page.data.user.email}
									</p>
								</div>

								<Button
									variant="ghost"
									href="/profile"
									class="justify-start gap-2"
									onclick={() => (mobileMenuOpen = false)}
								>
									<User class="h-4 w-4" />
									Profile
								</Button>

								<Button
									variant="ghost"
									href="/auth/logout"
									class="justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
									onclick={() => (mobileMenuOpen = false)}
								>
									<LogOut class="h-4 w-4" />
									Logout
								</Button>
							{:else}
								<div class="my-4 border-t"></div>

								<Button
									variant="outline"
									href="/login"
									class="justify-start"
									onclick={() => (mobileMenuOpen = false)}
								>
									Login
								</Button>

								<Button
									href="/register"
									class="justify-start"
									onclick={() => (mobileMenuOpen = false)}
								>
									Register
								</Button>
							{/if}

							<div class="my-4 border-t"></div>

							<div class="px-3 py-2">
								<div class="flex items-center gap-2">
									<ModeWatcherToggler />
									<p class="text-sm font-medium">Change appereance</p>
								</div>
							</div>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</header>
{/if}
