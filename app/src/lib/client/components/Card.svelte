<script lang="ts">
	let { title, info } = $props();
</script>

<div class="grid rounded-lg border p-4">
	<p class="text-xl">{title}</p>
	<p class="self-end text-lg text-teal-500">{info}</p>
</div>
