<style>
  .theme {
    width: 100vw;
    height: 100vw;

    --primary-color-hue: 200;
    --primary-color-saturation: 50%;
    --primary-color-base: var(--primary-color-hue),
      var(--primary-color-saturation);
    --primary-color-1: hsl(var(--primary-color-base), 90%);
    --primary-color-2: hsl(var(--primary-color-base), 80%);
    --primary-color-3: hsl(var(--primary-color-base), 70%);
    --primary-color-4: hsl(var(--primary-color-base), 60%);
    --primary-color-5: hsl(var(--primary-color-base), 50%);
    --primary-color-6: hsl(var(--primary-color-base), 40%);
    --primary-color-7: hsl(var(--primary-color-base), 30%);
    --primary-color-8: hsl(var(--primary-color-base), 20%);
    --primary-color-9: hsl(var(--primary-color-base), 10%);
  }
</style>

<div class="theme">
  <slot />
</div>
