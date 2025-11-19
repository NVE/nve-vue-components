<script setup lang="ts">
import { NveDarkmodeSwitch } from "nve-designsystem";
</script>

<template>
  <header class="main-header">
    <nav>
      <router-link to="/" class="img-link home-link">
        <img src="/images/logo.svg" alt="NVE ikon" />
      </router-link>
      <div class="home-link">
        <h1 class="title">Vue-demo</h1>
      </div>
      <div class="spacer" />
      <nve-darkmode-switch />
    </nav>
  </header>
</template>

<style scoped>
nav {
  height: var(--top-menu-height);
  display: flex;
  background-color: var(--color-page-bg);
  align-items: center;
  gap: var(--spacing-large);
  max-width: calc(
    50vw + 675px
  ); /* Venstre-alignet med browser. Høyre-alignet med article (som har padding) */
}
.title {
  font: var(--typography-label-medium);
  order: 1;
  z-index: 1;
}
nav .spacer {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 60px;
}

a {
  color: var(--color-text);
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: background-color 200ms ease-in-out;
  background-color: var(--color-page-bg);
  position: relative;
}

.img-link {
  height: 100%;
}

.img-link img {
  height: 100%;
}

a.home-link {
  order: 0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
