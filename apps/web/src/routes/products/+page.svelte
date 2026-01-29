<script lang="ts">
	const { data } = $props();
</script>

<div class="p-6">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Products</h1>
  </div>

  <!-- Grid -->
  {#if data.products.length === 0}
    <p class="text-gray-500">No products available.</p>
  {:else}
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {#each data.products as product}
        <a
          href={`/products/${product.id}`}
          class="group rounded-lg border bg-white p-4 transition hover:shadow-md"
        >
          <!-- Image placeholder -->
          <div class="mb-3 aspect-square rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Image
          </div>

          <!-- Product name -->
          <h3 class="mb-1 line-clamp-2 text-sm font-medium group-hover:underline">
            {product.name}
          </h3>

          <!-- Price -->
          <p class="text-sm font-semibold">
            Rp {product.price.toLocaleString()}
          </p>

          <!-- Stock (optional, dev-friendly) -->
          <p class="mt-1 text-xs text-gray-500">
            Stock: {product.stock}
          </p>
        </a>
      {/each}
    </div>
  {/if}
</div>

