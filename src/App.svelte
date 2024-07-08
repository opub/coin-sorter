<script lang="ts">
  import logo from './assets/coins.png';
  import RugCheck from './components/RugCheck.svelte';
  import DexToolsChart from './components/DexToolsChart.svelte';

  let mint: string = 'Bdpoziz793iwBUzzw2YDcPapdccrgNJ1ds5SZf1ppump';
</script>

<main>
  <h1><img src={logo} class="logo" alt="Logo" />Coin Sorter</h1>
  <input type="text" bind:value={mint} placeholder="Enter mint address" />
  <div class="w-full columns-2 gap-4">
    <DexToolsChart {mint} />
    <RugCheck {mint} />
  </div>
</main>

<style>
  .logo {
    height: 2em;
    padding: 0.2em;
    will-change: filter;
    transition: filter 300ms;
    display: inline;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #ef7903da);
  }
  input {
    margin: 1em 0;
    padding: 0.5em;
    font-size: 1em;
    border-radius: 0.25em;
    border: 1px solid #ccc;
    width: 100%;
    max-width: 420px;
  }
</style>
