<script setup lang="ts">
import { NveDarkmodeSwitch } from "nve-designsystem";
</script>

<template>
  <header class="main-header">
    <nav class="nav">
      <div class="nav-logo-title">
        <router-link to="/" class="img-link home-link">
          <img class="logo" src="/images/logo.svg" alt="NVE logo" />
        </router-link>

        <h1 class="title">NVE-Vue-Components Demo</h1>
      </div>
      <div class="switch"><nve-darkmode-switch /></div>
    </nav>
  </header>
</template>

<style scoped>
.main-header {
  width: 100vw;
  height: var(--top-menu-height);
  background-color: white;
  display: flex;
  align-items: center;
  z-index: 1;
}

.nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-large);
}

.logo {
  height: 74px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: unset;
}
.switch {
  margin-right: var(--spacing-x-large);
}

/*
nav {
  height: var(--top-menu-height);
  display: flex;
  background-color: white;
  align-items: center;
  gap: var(--spacing-large);
}
.title {
  font-size: 20px;
  order: 1;
  z-index: 1;
  font-weight: 600;
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
} */
</style>
