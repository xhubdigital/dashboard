<template>
  <div class="basic-side-dialog">
    <basic-dialog-header
      :title="title"
      :sub-title="subTitle"
      @left-action-click="$emit('left-action-click', $event)"
    />
    <slot name="top" />
    <q-separator />
    <q-scroll-area class="content">
      <slot />
    </q-scroll-area>
    <q-separator v-if="$slots.bottom" />
    <slot name="bottom" />
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import BasicDialogHeader from '@components/panel/BasicDialogHeader.vue';

@Options({
  components: {
    BasicDialogHeader,
  },
  emits: [
    'left-action-click',
  ],
})
export default class BasicSideDialog extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop() subTitle!: string;
}
</script>

<style lang="scss" scoped>
.basic-side-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;

  .content {
    flex-grow: 1;
  }
}
</style>
