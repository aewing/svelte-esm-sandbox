<script>
  export let clicks = 0;
</script>

<style>
  .wrapper {
    & > button {
      margin: 8px;
      padding: 8px;
      border: 2px solid #ccc;
      border-radius: 8px;
      appearance: none;
      outline: none;
      font-size: 16px;
      background: var(--primary-color-5, #333);
      color: var(--primary-color-contrast, #fff);
    }
  }
</style>

<div class="wrapper">
  <button
    on:click={() => {
      clicks = clicks + 1;
    }}
  >
    <slot />; Clicked
    {clicks}
    times.
  </button>
</div>
