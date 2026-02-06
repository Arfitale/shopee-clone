<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import favicon from '$lib/assets/favicon.svg';
	import { Mail, Lock, TriangleAlert } from '@lucide/svelte';
	import GoogleAuthButton from '$lib/components/auth/GoogleAuthButton.svelte';
	import Logo from '$lib/components/Logo.svelte';

	let { form } = $props();
</script>

<div class="flex min-h-screen flex-col gap-6 bg-background p-6">
	<!-- Header -->
	<header class="flex items-center justify-between">
		<Logo />
		<Button variant="outline" href="/register" class="gap-2 rounded-full px-5">Sign Up</Button>
	</header>

	<!-- Main (fills remaining height) -->
	<main class="flex flex-1">
		<div
			class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 md:max-w-384 md:grid-cols-2 xl:grid-cols-2 2xl:max-w-full"
		>
			<!-- Left: Form -->
			<div class="order-2 flex flex-col items-center justify-center px-8 text-center">
				<div class="form-container w-full max-w-2xl">
					<h1 class="text-3xl font-semibold tracking-tight">Log in to your account</h1>
					<p class="mt-2 text-muted-foreground">
						Welcome back! Get ready to find your dream products.
					</p>
					<form class="mt-8 space-y-6" method="POST">
						<div class="space-y-2">
							<Label for="email">Email</Label>
							<div class="relative">
								<Mail
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="email"
									type="email"
									name="email"
									placeholder="you@example.com"
									class="pl-9"
									required
								/>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="password">Password</Label>
							<div class="relative">
								<Lock
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="password"
									type="password"
									name="password"
									placeholder="Your password"
									class="pl-9"
									required
									minlength={8}
								/>
							</div>
						</div>

						{#if form?.error}
							<div class="flex items-center gap-2">
								<TriangleAlert class="h-5 w-5 text-red-400" />
								<p class="text-sm text-red-400">{form.error}</p>
							</div>
						{/if}

						<!-- Primary CTA -->
						<Button class="w-full rounded-full py-6 text-base" type="submit">Sign in</Button>

						<!-- Divider -->
						<div class="relative">
							<Separator />
							<span
								class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground"
							>
								OR
							</span>
						</div>

						<!-- Google -->
						<GoogleAuthButton login={true} />
					</form>
				</div>
			</div>

			<!-- Right: Hero -->
			<div class="relative order-1 hidden items-center justify-center md:flex">
				<div
					class="absolute inset-0 rounded-3xl bg-linear-to-br from-orange-200 via-orange-100 to-blue-300"
				></div>
				<img src={favicon} alt="App preview" class="relative z-10 max-h-130 drop-shadow-2xl" />
			</div>
		</div>
	</main>
</div>
