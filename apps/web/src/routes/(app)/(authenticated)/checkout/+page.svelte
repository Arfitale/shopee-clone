<script>
    const {data, form} = $props();
</script>


<div class="mx-auto max-w-4xl p-6">
  <h1 class="mb-6 text-2xl font-semibold">Checkout</h1>

  <div class="rounded-lg border p-4">
    {#each data.items as item}
      <div class="flex justify-between border-b py-2 text-sm">
        <span>{item.name} × {item.quantity}</span>
        <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
      </div>
    {/each}

    <div class="mt-4 flex justify-between font-semibold">
      <span>Total</span>
      <span>Rp {data.total.toLocaleString()}</span>
    </div>
  </div>

  <form method="POST" action="?/confirm" class="mt-6">
    <button
      type="submit"
      class="w-full rounded-md bg-black px-4 py-3 text-white hover:bg-black/90"
    >
      Confirm Order (Mock Payment)
    </button>
  </form>

  {#if form?.message}
    <p class="mt-3 text-sm text-red-600">{form.message}</p>
  {/if}
</div>