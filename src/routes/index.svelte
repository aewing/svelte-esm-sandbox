<script context="module">
  export async function preload(page, session) {
    return { foo: "bar" };
  }
</script>

<script>
  import Button from "../components/Button.svelte";
  import Theme from "../components/Theme/Theme.svelte";
  export let foo = "foo";
</script>

<style>
  h1 {
    color: blue;
  }
</style>

<Theme>
  <h1>Hello, world</h1>
  <Button>Hello, world!</Button>
</Theme>
