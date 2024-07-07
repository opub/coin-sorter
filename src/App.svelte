<script lang="ts">
  import logo from './assets/coins.png';
  import RugCheck from './components/RugCheck.svelte';
</script>

<main>
  <h1><img src={logo} class="logo" alt="Logo" />Coin Sorter</h1>
  <RugCheck mint="8VsixqDiwcZRtXCT4JwDhfJFHEmm4xBVYDXMkknrrR1Y" />
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
</style>
