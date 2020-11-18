<script context="module">
  export async function preload(page, session) {
    console.log("Slug preload", page.slug);
    return { foo: page.slug };
  }
</script>

<script>
  export let foo;
</script>

<style>
  h1 {
    color: blue;
  }
</style>

<svelte:head>
  <title>This is some cool shit</title>
</svelte:head>

<h1>such wow!!! {foo}</h1>
<slot />
