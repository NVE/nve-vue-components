<script setup lang="ts"></script>

<template>
  <div class="sidemenu left-grid-column">
    <router-link to="/" class="link" title="Gå til forsiden">
      <nve-icon name="home" />
      <span class="text">Forsiden</span>
    </router-link>
    <router-link to="/nve-table" class="link" title="Gå til Nve-table demo">
      <nve-icon name="table" />
      <span class="text">NVE-Table</span>
    </router-link>
    <router-link
      to="/nve-table-async"
      class="link"
      title="Gå til Async Nve-table demo"
    >
      <nve-icon name="table" />
      <span class="text">NVE-Table Async</span>
    </router-link>
    <router-link
      to="/nve-table-custom-components"
      class="link"
      title="Gå til Nve-table demo med custom components"
    >
      <nve-icon name="table" />
      <span class="text">NVE-Table med egne komponenter for celler</span>
    </router-link>

    <router-link
      to="/nve-table-sticky"
      class="link"
      title="Gå til Nve-table demo med sticky første kolonne"
    >
      <nve-icon name="table" />
      <span class="text">NVE-Table med sticky første kolonne</span>
    </router-link>
    <router-link
      to="/nve-table-sub-rows"
      class="link"
      title="Gå til Nve-table demo med utviderbare underrader"
    >
      <nve-icon name="table" />
      <span class="text">NVE-Table med utviderbare underrader</span>
    </router-link>
    <router-link
      to="/nve-table-events"
      class="link"
      title="Gå til Nve-table demo for events"
    >
      <nve-icon name="table" />
      <span class="text">NVE-Table med alle eventer</span>
    </router-link>
  </div>
</template>

<style scoped>
.sidemenu {
  width: 390px;
  background: var(--color-neutrals-background-primary);
  padding: var(--sizing-x-small);
  padding-bottom: var(--footer-height);
  padding-top: var(--main-padding-top);
  align-self: start;
  position: sticky;
  top: 0;
  overflow: auto;
  margin-block-start: 0;
  margin-inline-start: calc(var(--main-padding-top) * -1);
  height: calc(100vh - var(--top-menu-height));
  & .link {
    display: flex;
    align-items: center;
    gap: var(--spacing-small);
    color: var(--color-text);
    text-decoration: none;
    font: var(--typography-label-large);
    margin-block-end: var(--spacing-medium);
    &:hover .text {
      text-decoration: underline;
    }
    &.router-link-active .text {
      text-decoration: underline;
      font-weight: var(--font-weight-semibold);
    }
    & nve-icon {
      text-decoration: none !important;
      font-size: 24px;
    }
  }
}
</style>
