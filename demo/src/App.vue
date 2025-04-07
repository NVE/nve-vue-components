<script setup lang="ts">
import { onMounted } from "vue";
import MainHeader from "./components/MainHeader.vue";
import {
  icons,
  registerIconLibrary,
} from "nve-designsystem/registerIcons/systemLibraryCustomization.js";
import ComponentMenu from "./components/ComponentMenu.vue";

onMounted(() => {});

registerIconLibrary("system", {
  resolver: (name) => {
    return `data:image/svg+xml,${encodeURIComponent(icons[name])}`;
  },
});
</script>

<template>
  <div class="page" lang="no">
    <MainHeader />
    <main>
      <article>
        <ComponentMenu />
        <div class="content">
          <RouterView />
        </div>
      </article>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--neutrals-background-primary);
  display: grid;
  grid-template-rows: var(--top-menu-height) auto max-content;
}
main {
  background-color: var(--neutrals-background-primary-contrast);
}

main article {
  --main-padding-top: 65px;
  --main-padding-bottom: 45px;
  padding-left: var(--spacing-3x-large);
  padding-right: var(--spacing-3x-large);
  padding-top: 0;
  padding-bottom: var(--main-padding-bottom);
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns:
    [left-start] auto [left-end main-start] minmax(350px, 1600px)
    [main-end right-start] auto [right-end];
  & > * {
    grid-column: main;
  }
  &:deep(> .left-grid-column) {
    grid-column: left;
  }
  &:deep(> .right-grid-column) {
    grid-column: right;
  }
}
@media screen and (max-width: 1200px) {
  main article {
    padding-left: var(--spacing-x-large);
    padding-right: var(--spacing-x-large);
  }
}

@media screen and (max-width: 800px) {
  main article {
    padding-left: var(--spacing-medium);
    padding-right: var(--spacing-medium);
  }
}
.content {
  margin-inline-start: var(--spacing-large);
  background-color: var(--neutrals-background-primary);
  padding: var(--spacing-2x-large) var(--spacing-3x-large);
  &:deep(h2) {
    font: var(--header-medium);
    margin-block-end: var(--spacing-large);
  }
}
</style>
