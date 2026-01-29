<script lang="ts">
	const { data, form } = $props();
</script>

<a href="/products">Back to products</a>
{#if data.product}
<div class="mx-auto max-w-6xl p-6">
  <div class="grid gap-8 md:grid-cols-2">
    <!-- Image section -->
    <div class="rounded-xl bg-gray-100 aspect-square flex items-center justify-center text-gray-400">
      Product Image
    </div>

    <!-- Info section -->
    <div class="flex flex-col">
      <!-- Name -->
      <h1 class="text-2xl font-semibold mb-2">
        {data.product.name}
      </h1>

      <!-- Price -->
      <p class="text-xl font-bold mb-4">
        Rp {data.product.price.toLocaleString()}
      </p>

      <!-- Description -->
      {#if data.product.description}
        <p class="mb-6 text-sm text-gray-600 leading-relaxed">
          {data.product.description}
        </p>
      {/if}

      <!-- Stock -->
      <p class="mb-4 text-sm text-gray-500">
        Stock available: {data.product.stock}
      </p>

      <!-- Add to cart -->
      <form method="POST" action="?/addToCart" class="flex gap-4 items-center">
        <button
          type="submit"
          class="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90"
        >
          Add to Cart
        </button>
      </form>

      <!-- Error -->
      {#if form?.error}
        <p class="mt-3 text-sm text-red-600">
          {form.error}
        </p>
      {/if}
    </div>
  </div>
</div>
{/if}
