<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
</script>

<div class="min-h-screen bg-muted/40">
	<!-- Hero -->
	<section class="mx-auto max-w-6xl px-6 py-16">
		<h2 class="mb-4 text-3xl font-semibold tracking-tight">Simple Marketplace MVP</h2>
		<p class="mb-8 max-w-xl text-muted-foreground">
			A full-stack e-commerce MVP built with SvelteKit, Drizzle, PostgreSQL, and modern backend
			practices.
		</p>

		<div class="flex gap-4">
			<Button size="lg">
				<a href="/products">Browse Products</a>
			</Button>
			<Button size="lg" variant="outline">
				<a href="/orders">View Orders</a>
			</Button>
		</div>
	</section>

	<!-- Feature Cards -->
	<section class="mx-auto max-w-6xl px-6 pb-20">
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Products</CardTitle>
					<CardDescription>Explore items available in the marketplace</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline">
						<a href="/products">Go to Products</a>
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Cart</CardTitle>
					<CardDescription>Review and manage items before checkout</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline">
						<a href="/cart">Open Cart</a>
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Orders</CardTitle>
					<CardDescription>Track your order history and statuses</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline">
						<a href="/orders">View Orders</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	</section>
</div>
