<template>
  <q-input
    ref="qInputRef"
    v-bind="$props"
    class="text-input"
    :label="undefined"
    :for="$attrs.name"
    outlined
    dense
  >
    <template #before>
      <div class="label">
        {{ label }}
      </div>
    </template>
    <template
      v-for="(_, slot) of $slots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope || {}"
      />
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: true,
  props: {
    label: {
      type: String,
      default: null,
    },
  },

  methods: {
    focus() {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      (this.$refs.qInputRef as any).focus();
    },
  },
});
</script>

<style lang="scss" scoped>
.text-input {
  flex-direction: column;

  ::v-deep(.q-field__before) {
    height: unset;
  }
}

.label {
  font-size: 14px;
  color: #545563;
}
</style>
