<script lang="ts">
	let { title, info } = $props();
</script>

<div class="grid rounded-lg border p-2 sm:p-4">
	<p class="text-base sm:text-lg md:text-xl">{title}</p>
	<p class="self-end text-sm sm:text-base md:text-lg text-teal-500">{info}</p>
</div>
