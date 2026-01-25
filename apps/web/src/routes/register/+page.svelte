<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    
    let form: { error?: string } | null = null;
    
    onMount(() => {
        const urlParams = new URLSearchParams(page.url.search);
        const error = urlParams.get('error');
        if (error) {
        form = { error };
        }
    });
</script>

<form method="POST">
  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required />
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required />
  </div>
  <button type="submit">Register</button>
</form>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}