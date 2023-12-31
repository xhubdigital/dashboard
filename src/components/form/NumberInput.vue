<template>
  <text-input
    class="number-input"
    v-bind="$attrs"
    :model-value="currentValue"
    type="number"
    inputmode="numeric"
    step="any"
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
      type: [Number, String],
      default: '',
    },
  },

  emits: ['update:modelValue'],

  computed: {
    currentValue() {
      return this.modelValue;
    },
  },

  methods: {
    onUpdateValue(value: string) {
      const val = value === '' ? '' : Number(value);
      this.$emit('update:modelValue', val);
    },
  },
});
</script>

<style lang="scss" scoped>
.number-input {
  ::v-deep(input) {
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
