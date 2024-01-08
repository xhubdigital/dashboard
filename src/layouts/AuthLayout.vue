<template>
  <q-layout view="lHh Lpr lFf">
    <router-view />
  </q-layout>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
export default class AuthLayout extends Vue {
}
</script>

<style lang="scss" scoped>
.content {
  // max-width: 400px;
  margin: 0 auto;
}
</style>
