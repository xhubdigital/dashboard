<template>
  <text-input
    v-bind="$attrs"
    :model-value="currentValue"
    inputmode="numeric"
    prefix="R$"
    mask="#,##"
    fill-mask="0"
    reverse-fill-mask
    @update:model-value="onUpdateValue"
  >
    <template
      v-for="(_, slot) of $slots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
  </text-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TextInput from './TextInput.vue';

export default defineComponent({
  components: {
    TextInput,
  },

  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    currentValue() {
      return (this.modelValue * 100).toFixed(0);
    },
  },

  methods: {
    onUpdateValue(value: string) {
      this.$emit('update:modelValue', Number(value.replace(',', '.')));
    },
  },
});
</script>
