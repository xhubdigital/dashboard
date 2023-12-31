<template>
  <q-layout
    class="dashboard-layout"
    view="hHh Lpr lFf"
  >
    <q-header>
      <panel-header
        @toggle-drawer="toggleDrawer"
      />
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="350"
    >
      <panel-menu />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import PanelHeader from '@components/panel/PanelHeader.vue';
import PanelMenu from '@components/panel/PanelMenu.vue';

@Options({
  components: { PanelHeader, PanelMenu },
})
export default class MainLayout extends Vue {
  leftDrawerOpen = false;

  toggleDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
}
</script>
