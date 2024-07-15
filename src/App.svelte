<script lang="ts">
  import logo from './assets/coins.png';
  import { getTokenInfo, type TokenInfo, fetchItem, storeItem } from './lib/utils';
  import RugCheck from './components/RugCheck.svelte';
  import DexToolsChart from './components/DexToolsChart.svelte';
  import JupiterSwap from './components/JupiterSwap.svelte';

  let mint: string = fetchItem('mint');
  let pair: string;
  let info: TokenInfo | null;
  let previous: string;

  $: if (mint && mint !== previous) {
    storeItem('mint', mint);
    getTokenInfo(mint).then((tokenInfo: TokenInfo | null) => {
      info = tokenInfo;
      if (info?.pool) {
        pair = info.pool;
      }
    });
    previous = mint;
  }
</script>

<main class="flex flex-col min-h-screen">
  <!-- Header -->
  <header class="text-white p-2 text-nowrap align-middle">
    <h1 class="text-4xl font-extrabold"><img src={logo} class="logo" alt="Logo" />Coin Sorter</h1>
  </header>

  <!-- Content -->
  <div class="flex flex-grow overflow-hidden">
    <div class="basis-1/4 overflow-hidden p-2">
      <div class="flex-1 overflow-y-auto p-2">
        <input type="text" bind:value={mint} placeholder="Enter mint address" />
        {#if info}
          <div class="p-4">
            <p class="p-2">Name: {info.name}</p>
            <p class="p-2">Symbol: {info.symbol}</p>
            <!-- info.logoURI -->
          </div>
        {/if}
        <JupiterSwap {mint} />
      </div>
    </div>
    <div class="basis-1/2 overflow-hidden p-2">
      <div class="flex-1 overflow-y-auto">
        <DexToolsChart {pair} />
      </div>
    </div>
    <div class="basis-1/4 overflow-hidden p-2">
      <div class="flex-1 overflow-y-auto">
        <RugCheck {mint} />
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="text-white p-2 mt-auto">
    <i>Created by tedoc</i>
  </footer>
</main>

<style>
  .logo {
    height: 50px;
    width: 50px;
    display: inline-block;
  }

  input {
    font-size: 1em;
    border-radius: 0.25em;
    border: 1px solid #ccc;
    width: 100%;
    max-width: 420px;
    color: black;
  }
</style>
