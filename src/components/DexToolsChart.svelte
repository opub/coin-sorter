<script lang="ts">
  import { getTokenInfo, type TokenInfo } from '../lib/utils';

  export let mint: string;
  let pair: string | null;

  $: if (mint) {
    getTokenInfo(mint).then((info: TokenInfo | null) => {
      if (info?.pool) {
        pair = info.pool;
      }
    });
  }
</script>

<div>
  {#if pair}
    <iframe
      id="dextools-widget"
      title="DEXTools Trading Chart"
      width="500"
      height="400"
      src="https://www.dextools.io/widget-chart/en/solana/pe-light/{pair}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false"
    ></iframe>
  {/if}
</div>
