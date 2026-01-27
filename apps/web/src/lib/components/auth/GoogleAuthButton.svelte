<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import googleLogo from '$lib/assets/google.svg';

	const { login = false } = $props();
</script>

<Button variant="outline" href="/auth/google" class="w-full gap-2 rounded-full py-6 text-base">
	<img src={googleLogo} alt="Google" class="h-6 w-6" />
	{login ? 'Sign in with Google' : 'Sign up with Google'}
</Button>
