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
      <h2>RugCheck - Total Score: {tokenReport.score}</h2>

      <p><strong>Risks:</strong></p>
      {#if tokenReport.risks.length > 0}
        <ul>
          {#each tokenReport.risks as risk}
            <li>
              <strong>{risk.name}:</strong>
              {risk.value}<br />
              <em>{risk.description}</em><br />
              <strong>Score:</strong>
              {risk.score}<br />
              <strong>Level:</strong>
              {risk.level}
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
    background-color: green;
  }
  .yellow {
    background-color: yellow;
    color: black;
  }
  .red {
    background-color: red;
  }
</style>
