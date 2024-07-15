<script lang="ts">
  import { onMount } from 'svelte';

  export let mint: string;

  const RPC: string =
    'https://fragrant-green-tab.solana-mainnet.quiknode.pro/9562d9127f7a75d7ab3e3be61c85c78bdac7ccfa/';

  onMount(() => {
    if (mint) {
      console.log('JupiterSwap', mint);

      window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'integrated-terminal',
        endpoint: RPC,
        defaultExplorer: 'Solscan',
        formProps: {
          swapMode: 'ExactIn',
          initialAmount: '100000',
          initialOutputMint: mint,
          initialSlippageBps: 50
        }
      });
    }
  });
</script>

<div id="integrated-terminal"></div>
