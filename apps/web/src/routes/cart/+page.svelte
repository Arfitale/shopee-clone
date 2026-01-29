<script lang="ts">
    import { CirclePlus, CircleMinus } from '@lucide/svelte';

    const {data} = $props();
</script>

{#if data.items.length === 0}
    <p>Your cart is empty.</p>
{:else}
    <h1>Your Shopping Cart</h1>
    <ul>
        {#each data.items as item}
            <li>
                <h2>
                    {item.name} - ${item.price} x {item.quantity}
                </h2>
                <div class="actions">
                    <form action="?/increase" method="POST">
                        <input type="hidden" name="cartItemId" value={item.cartItemId} />
                        <button type="submit">
                            <CirclePlus size="16" /> 
                        </button>
                    </form>
                    <form action="?/decrease" method="POST">
                        <input type="hidden" name="cartItemId" value={item.cartItemId} />
                        <button type="submit">
                            <CircleMinus size="16" />
                        </button>
                    </form>
                    
                    <form action="?/remove" method="POST">
                        <input type="hidden" name="cartItemId" value={item.cartItemId} />
                        <button type="submit">
                            Remove
                        </button>
                    </form>
                </div>
            </li>
        {/each}
    </ul>
    <p>Total: ${data.total}</p>
{/if}