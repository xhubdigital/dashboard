<template>
  <policies-page
    :content="content"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { path } from 'ramda';

import { messages } from '@boot/i18n';

import PoliciesPage from './PoliciesPage.vue';

@Options({
  components: { PoliciesPage },
})
export default class ContentsPolicies extends Vue {
  get content() {
    return path(
      [this.$i18n.locale, 'policies', 'tabs', 1, 'content'],
      messages,
    );
  }
}
</script>
