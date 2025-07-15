<template>
  <q-select
    ref="qselect"
    v-bind="$props"
    class="input"
    :label="undefined"
    :for="$attrs.name"
    outlined
    dense
    @new-value="$emit('new-value', $event)"
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
  </q-select>
</template>

<script>
export default {
  inheritAttrs: true,
  props: {
    label: {
      type: String,
      default: null,
    },
  },
  emits: ['new-value'],
  methods: {
    focus() {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      this.$refs.qselect.focus();
    },

    blur() {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      this.$refs.qselect.blur();
    },

    hidePopup() {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      this.$refs.qselect.hidePopup();
    },

    updateInputValue(value) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      this.$refs.qselect.updateInputValue(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
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
