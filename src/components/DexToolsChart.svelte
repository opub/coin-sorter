<script lang="ts">
  export let pair: string | null;

  if (pair) {
    console.log('DexToolsChart', pair);
  }
</script>

<div>
  {#if pair}
    <iframe
      id="dextools-widget"
      title="DEXTools Trading Chart"
      frameborder="0"
      class="w-full"
      height="600"
      src="https://www.dextools.io/widget-chart/en/solana/pe-light/{pair}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=false"
    ></iframe>
  {/if}
</div>
