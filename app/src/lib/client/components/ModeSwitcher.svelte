<script>
	import { toggleMode, mode } from 'mode-watcher';
</script>

<button onclick={toggleMode} class="transition-all">{$mode === 'dark' ? '💡' : '💤'}</button>
