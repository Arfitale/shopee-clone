<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import {
		ShoppingBag,
		ShoppingCart,
		Package,
		TrendingUp,
		Shield,
		Zap,
		ArrowRight,
		Sparkles
	} from '@lucide/svelte';

	let { data } = $props();

	const features = [
		{
			icon: ShoppingBag,
			title: 'Products',
			description: 'Explore our curated collection of quality items',
			href: '/products',
			color: 'text-blue-600',
			bgColor: 'bg-blue-100',
			count: 5
		},
		{
			icon: ShoppingCart,
			title: 'Shopping Cart',
			description: 'Review and manage items before checkout',
			href: '/cart',
			color: 'text-green-600',
			bgColor: 'bg-green-100'
		},
		{
			icon: Package,
			title: 'Order History',
			description: 'Track your orders and delivery status',
			href: '/orders',
			color: 'text-purple-600',
			bgColor: 'bg-purple-100',
			count: 5
		}
	];

	const highlights = [
		{
			icon: Zap,
			title: 'Fast Delivery',
			description: 'Quick shipping on all orders'
		},
		{
			icon: Shield,
			title: 'Secure Payment',
			description: 'Your transactions are protected'
		},
		{
			icon: TrendingUp,
			title: 'Best Prices',
			description: 'Competitive pricing guaranteed'
		}
	];
</script>

<div class="min-h-screen bg-linear-to-b from-background to-muted/40">
	<!-- Hero Section -->
	<section class="relative overflow-hidden">
		<!-- Background decoration -->
		<div
			class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
		></div>
		<div class="absolute top-0 right-0 -z-10 h-125 w-125 rounded-full bg-primary/5 blur-3xl"></div>
		<div class="absolute bottom-0 left-0 -z-10 h-75 w-75 rounded-full bg-blue-500/5 blur-3xl"></div>

		<div class="container mx-auto max-w-6xl px-6 py-20 sm:py-28">
			<div class="flex flex-col items-center text-center">
				<!-- Badge -->
				<Badge variant="secondary" class="mb-6 gap-1 px-3 py-1">
					<Sparkles class="h-3 w-3" />
					Simple & Powerful E-commerce
				</Badge>

				<!-- Headline -->
				<h1 class="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
					Your Modern
					<span class="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
						Marketplace
					</span>
					<br />
					Starts Here
				</h1>

				<!-- Subheadline -->
				<p class="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
					A full-stack e-commerce platform built with SvelteKit, Drizzle ORM, and PostgreSQL.
					Experience seamless shopping with modern technology.
				</p>

				<!-- CTA Buttons -->
				<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
					<Button size="lg" href="/products" class="gap-2 text-base">
						<ShoppingBag class="h-5 w-5" />
						Browse Products
						<ArrowRight class="h-4 w-4" />
					</Button>
					{#if data?.user}
						<Button size="lg" variant="outline" href="/orders" class="gap-2 text-base">
							<Package class="h-5 w-5" />
							My Orders
						</Button>
					{:else}
						<Button size="lg" variant="outline" href="/register" class="gap-2 text-base">
							Get Started Free
						</Button>
					{/if}
				</div>

				<!-- Welcome message for logged-in users -->
				{#if data?.user}
					<p class="mt-6 text-sm text-muted-foreground">
						Welcome back, <span class="font-semibold text-foreground">{data.user.email}</span>! 👋
					</p>
				{/if}
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="container mx-auto max-w-6xl px-6 py-16">
		<div class="mb-12 text-center">
			<h2 class="mb-3 text-3xl font-bold tracking-tight">Quick Access</h2>
			<p class="text-muted-foreground">Everything you need for a smooth shopping experience</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature}
				{@const FeatureIcon = feature.icon}
				<Card
					class="group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
				>
					<div
						class="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br {feature.bgColor} opacity-20 blur-2xl transition-transform group-hover:scale-150"
					></div>

					<CardHeader>
						<div class="mb-3 flex items-center justify-between">
							<div class="flex h-12 w-12 items-center justify-center rounded-lg {feature.bgColor}">
								<FeatureIcon />
							</div>
							{#if feature.count !== undefined}
								<Badge variant="secondary">{feature.count}</Badge>
							{/if}
						</div>
						<CardTitle class="text-xl">{feature.title}</CardTitle>
						<CardDescription class="text-base">
							{feature.description}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="ghost" href={feature.href} class="group/button w-full justify-between">
							Explore
							<ArrowRight class="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
						</Button>
					</CardContent>
				</Card>
			{/each}
		</div>
	</section>

	<!-- Highlights Section -->
	<section class="container mx-auto max-w-6xl px-6 py-16">
		<div class="rounded-2xl border bg-card p-8 sm:p-12">
			<div class="mb-10 text-center">
				<h2 class="mb-3 text-3xl font-bold tracking-tight">Why Choose Us</h2>
				<p class="text-muted-foreground">
					We're committed to providing the best shopping experience
				</p>
			</div>

			<div class="grid gap-8 sm:grid-cols-3">
				{#each highlights as highlight}
					{@const HighlightIcon = highlight.icon}
					<div class="flex flex-col items-center text-center">
						<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<HighlightIcon />
						</div>
						<h3 class="mb-2 font-semibold">{highlight.title}</h3>
						<p class="text-sm text-muted-foreground">{highlight.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="container mx-auto max-w-6xl px-6 py-20">
		<Card class="overflow-hidden border-2">
			<div class="bg-linear-to-r from-primary/10 via-primary/5 to-background p-8 sm:p-12">
				<div class="mx-auto max-w-2xl text-center">
					<h2 class="mb-4 text-3xl font-bold tracking-tight">Ready to Start Shopping?</h2>
					<p class="mb-8 text-lg text-muted-foreground">
						Join thousands of satisfied customers and discover amazing products today.
					</p>
					<div class="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
						<Button size="lg" href="/products" class="gap-2">
							<ShoppingBag class="h-5 w-5" />
							Browse Products
						</Button>
						{#if !data?.user}
							<Button size="lg" variant="outline" href="/register">Create Account</Button>
						{/if}
					</div>
				</div>
			</div>
		</Card>
	</section>
</div>
