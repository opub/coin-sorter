<script lang="ts">
  import logo from './assets/coins.png';
</script>

<main>
  <div>
    <img src={logo} class="logo" alt="Logo" />
  </div>
  <h1>Coin Sorter</h1>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
</style>
