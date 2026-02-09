<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import * as Form from '$lib/components/ui/form/index.js';
	import {
		ArrowLeft,
		Package,
		Truck,
		CircleCheck,
		CircleAlert,
		ImagePlus,
		DollarSign,
		Hash
	} from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let currentStep = $state(1);
	let isSubmitting = $state(false);

	let productName = $state('');
	let description = $state(null);
	let productImage = $state<File | null>(null);
	let priceInIdr = $state<number | null>(null);
	let stock = $state<number | null>(null);
	let sku = $state(null);

	let imageInput: HTMLInputElement;
	let previewImage = $state<string | null>(null);

	const steps = [
		{
			number: 1,
			title: 'Product Details',
			description: 'Basic information',
			icon: Package
		},
		{
			number: 2,
			title: 'Pricing & Stock',
			description: 'Set price and inventory',
			icon: DollarSign
		},
		{
			number: 3,
			title: 'Review',
			description: 'Confirm and publish',
			icon: CircleCheck
		}
	];

	function handleImageChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		const file = files?.[0];
		imageInput.files = files;

		if (file) {
			productImage = file;

			// Create preview URL
			if (previewImage) {
				URL.revokeObjectURL(previewImage);
			}
			previewImage = URL.createObjectURL(file);
		}
	}

	function clearImage() {
		if (previewImage) {
			URL.revokeObjectURL(previewImage);
		}
		productImage = null;
		previewImage = null;
	}
</script>

<div class="min-h-screen bg-muted/40 p-6">
	<!-- Back Navigation -->
	<div class="mb-6">
		<Button variant="ghost" href="/seller/products" class="gap-2 pl-0">
			<ArrowLeft class="h-4 w-4" />
			Back to Products
		</Button>
	</div>

	{#if form?.error}
		<Alert variant="destructive" class="mx-auto mb-6 max-w-5xl">
			<CircleAlert class="h-4 w-4" />
			<AlertDescription>
				{form.error}
			</AlertDescription>
		</Alert>
	{/if}

	<div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4">
		<!-- Stepper Sidebar -->
		<Card class="sticky top-6 h-fit md:col-span-1">
			<CardContent class="p-4">
				<nav class="space-y-2">
					{#each steps as step}
						<button
							type="button"
							onclick={() => (currentStep = step.number)}
							class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors {currentStep ===
							step.number
								? 'bg-accent text-accent-foreground'
								: 'text-muted-foreground hover:bg-accent/50'}"
						>
							<div
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full {currentStep ===
								step.number
									? 'bg-primary text-primary-foreground'
									: 'border'}"
							>
								{#if currentStep > step.number}
									<CircleCheck class="h-4 w-4" />
								{:else}
									<step.icon />
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">{step.title}</p>
								<p class="truncate text-xs text-muted-foreground">{step.description}</p>
							</div>
						</button>
					{/each}
				</nav>
			</CardContent>
		</Card>

		<Card class="md:col-span-3">
			<CardHeader>
				<CardTitle class="text-2xl">
					{steps[currentStep - 1].title}
				</CardTitle>
				<CardDescription>
					{steps[currentStep - 1].description}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div class="space-y-6">
					<form method="POST" enctype="multipart/form-data">
						<!-- ALWAYS PRESENT -->
						<input type="hidden" name="product-name" bind:value={productName} />
						<input type="hidden" name="description" bind:value={description} />
						<input type="hidden" name="price" bind:value={priceInIdr} />
						<input type="hidden" name="stock" bind:value={stock} />
						<input type="hidden" name="sku" bind:value={sku} />
						<input type="file" name="product-image" bind:this={imageInput} hidden />

						<!-- Step 1: Product Details -->
						{#if currentStep === 1}
							<div class="space-y-6">
								<!-- Product Name -->
								<div class="space-y-2">
									<Label for="product-name">
										Product Name <span class="text-destructive">*</span>
									</Label>
									<Input
										placeholder="e.g. Mechanical Keyboard RGB"
										required
										minlength={3}
										maxlength={100}
										bind:value={productName}
									/>
									<p class="text-xs text-muted-foreground">
										Choose a clear, descriptive name for your product
									</p>
								</div>

								<!-- Description -->
								<div class="space-y-2">
									<Label for="description">
										Description
										<span class="text-xs text-muted-foreground">(optional)</span>
									</Label>
									<Textarea
										rows={5}
										placeholder="Describe your product features, specifications, and benefits..."
										maxlength={1000}
										bind:value={description}
									/>
									<p class="text-xs text-muted-foreground">
										Provide detailed information to help buyers make informed decisions
									</p>
								</div>

								<!-- Image Upload -->
								<div class="space-y-2">
									<Label for="image">
										Product Image
										<span class="text-xs text-muted-foreground">(optional)</span>
									</Label>
									<div class="flex items-center gap-4">
										<div
											class="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted"
										>
											{#if previewImage}
												<img src={previewImage} alt="Preview" />
											{:else}
												<ImagePlus class="h-8 w-8 text-muted-foreground" />
											{/if}
										</div>
										<div class="flex-1">
											<Input type="file" accept="image/*" onchange={handleImageChange} />
											<p class="mt-2 text-xs text-muted-foreground">
												Upload a clear product image (JPG, PNG, max 5MB)
											</p>
										</div>
									</div>
									<Button variant="outline" onclick={clearImage}>Clear</Button>
								</div>

								<div class="flex justify-end">
									<Button type="button" onclick={() => (currentStep = 2)}>Next Step →</Button>
								</div>
							</div>
						{/if}

						<!-- Step 2: Pricing & Stock -->
						{#if currentStep === 2}
							<div class="space-y-6">
								<!-- Price -->
								<div class="space-y-2">
									<Label for="price">
										Price (IDR) <span class="text-destructive">*</span>
									</Label>
									<div class="relative">
										<DollarSign class="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											min={0}
											step={1000}
											placeholder="100000"
											required
											class="pl-10"
											bind:value={priceInIdr}
										/>
									</div>
									<p class="text-xs text-muted-foreground">
										Set a competitive price for your product
									</p>
								</div>

								<!-- Stock -->
								<div class="space-y-2">
									<Label for="stock">
										Stock Quantity <span class="text-destructive">*</span>
									</Label>
									<div class="relative">
										<Hash class="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											type="number"
											min={0}
											placeholder="10"
											required
											class="pl-10"
											bind:value={stock}
										/>
									</div>
									<p class="text-xs text-muted-foreground">How many units do you have available?</p>
								</div>

								<!-- SKU (Optional) -->
								<div class="space-y-2">
									<Label for="sku">
										SKU
										<span class="text-xs text-muted-foreground">(optional)</span>
									</Label>
									<Input placeholder="PROD-001" maxlength={50} bind:value={sku} />
									<p class="text-xs text-muted-foreground">
										Stock Keeping Unit for inventory tracking
									</p>
								</div>

								<div class="flex justify-between">
									<Button type="button" variant="outline" onclick={() => (currentStep = 1)}>
										← Previous
									</Button>
									<Button type="button" onclick={() => (currentStep = 3)}>Review →</Button>
								</div>
							</div>
						{/if}

						<!-- Step 3: Review & Submit -->
						{#if currentStep === 3}
							<div>
								<div class="space-y-6">
									<Alert>
										<CircleCheck class="h-4 w-4" />
										<AlertDescription
											>Review your product details before publishing</AlertDescription
										>
									</Alert>

									<div class="space-y-4 rounded-lg border bg-muted/50 p-6">
										<div>
											<p class="text-sm text-muted-foreground">Product will be published</p>
											<p class="text-lg font-semibold">Ready to go live</p>
										</div>
										<Separator />
										<p class="text-sm text-muted-foreground">
											After publishing, your product will be visible to all customers. You can edit
											or unpublish it anytime from your products page.
										</p>
									</div>

									<div class="flex justify-between">
										<Button type="button" variant="outline" onclick={() => (currentStep = 2)}>
											← Previous
										</Button>
										<Button type="submit" disabled={isSubmitting} class="gap-2">
											<CircleCheck class="h-4 w-4" />
											{isSubmitting ? 'Publishing...' : 'Publish Product'}
										</Button>
									</div>
								</div>
							</div>
						{/if}
					</form>
				</div>
				<!-- Main Form -->
			</CardContent>
		</Card>
	</div>
</div>
