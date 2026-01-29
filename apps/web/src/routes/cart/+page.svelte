<script lang="ts">
    import { TrashIcon } from '@lucide/svelte';

    const {data} = $props();
</script>

<div class="mx-auto max-w-5xl p-6">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-semibold">My Cart</h1>

    <a
      href="/products"
      class="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
    >
      Continue shopping
    </a>
  </div>

  {#if data.items.length === 0}
    <p class="text-gray-500">Your cart is empty.</p>
  {:else}
    <!-- Cart Table -->
    <div class="overflow-hidden rounded-lg border">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="p-4">Product</th>
            <th class="p-4">Price</th>
            <th class="p-4">Quantity</th>
            <th class="p-4">Subtotal</th>
            <th class="p-4"></th>
          </tr>
        </thead>

        <tbody>
          {#each data.items as item}
            <tr class="border-t">
              <!-- Product -->
              <td class="p-4 font-medium flex gap-2 items-center">
                <div class="product-image w-16 h-16 rounded-md overflow-hidden">
                    <img src="https://sc04.alicdn.com/kf/Hd47e3d23df064c6089bc577076491ab1V.png" class="w-full h-full object-fit" alt="placeholder">
                </div>
                <h3>{item.name}</h3>
              </td>

              <!-- Price -->
              <td class="p-4">
                Rp {item.price.toLocaleString()}
              </td>

              <!-- Quantity -->
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <form method="POST" action="?/decrease" >
                    <input type="hidden" name="cartItemId" value={item.cartItemId} />
                    <button
                      type="submit"
                      class="h-8 w-8 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                  </form>

                  <span class="w-6 text-center">
                    {item.quantity}
                  </span>

                  <form method="POST" action="?/increase">
                    <input type="hidden" name="cartItemId" value={item.cartItemId} />
                    <button
                      type="submit"
                      class="h-8 w-8 rounded border hover:bg-gray-100"
                    >
                      +
                    </button>
                  </form>
                </div>
              </td>

              <!-- Subtotal -->
              <td class="p-4 font-medium">
                Rp {(item.price * item.quantity).toLocaleString()}
              </td>

              <!-- Remove -->
              <td class="p-4">
                <form method="POST" action="?/remove">
                  <input type="hidden" name="cartItemId" value={item.cartItemId} />
                  <button
                    type="submit"
                    class="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </form>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div class="mt-6 flex justify-end">
      <div class="w-full max-w-sm rounded-lg border p-4">
        <div class="mb-4 flex justify-between text-sm">
          <span>Total</span>
          <span class="font-semibold">
            Rp {data.total.toLocaleString()}
          </span>
        </div>

        <button
          class="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-black/90"
        >
          Checkout
        </button>
      </div>
    </div>
  {/if}
</div>