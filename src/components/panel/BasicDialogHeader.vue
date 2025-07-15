<template>
  <div class="flex items-center q-pa-md">
    <q-btn
      class="on-left"
      :icon="leftButtonIcon"
      round
      flat
      @click="$emit('left-action-click', $event)"
    />
    <div>
      <div class="text-h6 text-bold">
        {{ title }}
      </div>
      <div class="sub-title">
        {{ subTitle }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

@Options({
  emits: [
    'left-action-click',
  ],
})
export default class BasicDialogHeader extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop() subTitle!: string;
  @Prop({ default: 'mdi-arrow-left' }) leftButtonIcon!: string;
}
</script>

<style lang="scss" scoped>
.sub-title {
  color: $grey-6;
}
</style>
