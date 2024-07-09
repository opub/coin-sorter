<script lang="ts">
  import axios from 'axios';

  export let mint: string;

  let tokenReport: {
    tokenProgram: string;
    tokenType: string;
    risks: Array<{
      name: string;
      value: string;
      description: string;
      score: number;
      level: string;
    }>;
    score: number;
  } | null = null;

  let bgColor: string = 'white';

  const fetchTokenReport = async () => {
    try {
      const response = await axios.get(`https://api.rugcheck.xyz/v1/tokens/${mint}/report/summary`);
      tokenReport = response.data;
      setBgColor(tokenReport?.score ?? -1);
    } catch (error) {
      console.error('Error fetching token report:', error);
    }
  };

  const setBgColor = (score: number) => {
    if (score < 0) {
      bgColor = 'white';
    } else if (score < 1000) {
      bgColor = 'green';
    } else if (score > 5000) {
      bgColor = 'red';
    } else {
      bgColor = 'yellow';
    }
  };

  $: if (mint) {
    fetchTokenReport();
  }
</script>

<a href="https://rugcheck.xyz/tokens/{mint}" target="_blank">
  <div class="token-report {bgColor}">
    {#if tokenReport}
      <h2 class="text-l font-bold">RugCheck - Total Score: {tokenReport.score}</h2>
      {#if tokenReport.risks.length > 0}
        <ul>
          {#each tokenReport.risks as risk}
            <li class="p-2">
              <p class="uppercase font-medium">{risk.level} - {risk.name}</p>
              <p>{risk.description} {risk.value}</p>
            </li>
          {/each}
        </ul>
      {:else}
        <p>💎 No risks found.</p>
      {/if}
    {/if}
  </div>
</a>

<style>
  .token-report {
    padding: 1rem;
    border-radius: 0.5rem;
    color: white;
    text-align: left;
  }
  .white {
    background-color: white;
    color: black;
  }
  .green {
    background-color: rgba(0, 255, 0, 0.5);
  }
  .yellow {
    background-color: rgba(255, 255, 0, 0.7);
    color: black;
  }
  .red {
    background-color: rgba(255, 0, 0, 0.5);
  }
</style>
