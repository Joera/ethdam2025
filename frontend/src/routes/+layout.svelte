<script lang="ts">
    import { goto } from '$app/navigation';


	// import Entry from '$lib/components/Entry.svelte'


    // import { avatar_state, profile_state } from '$lib/store/state.store.js';
	export let data;

	const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

	const handleInviteRequested = async (event: any) => {

	}

</script>

<style global lang="scss">
	@use '../global' as *;




 </style>

<svelte:head>
</svelte:head>

<main>


	<h1>Trustfund</h1>
	


	<section class="container">
		<slot />
	</section>
</main>





