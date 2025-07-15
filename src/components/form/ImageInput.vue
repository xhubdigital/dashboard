<template>
  <div
    class="image-input"
    :class="{ 'has-value': hasValue, 'no-value': !hasValue }"
  >
    <div
      v-if="label"
      class="label"
    >
      {{ label }}
    </div>
    <q-field
      v-bind="$props"
      :label="null"
      borderless
    >
      <div
        class="preview fit flex flex-center"
        @click="openFileExplorer"
      >
        <q-img
          :src="previewValue"
          no-spinner
          class="full-width"
          :class="{ round: round !== false }"
          :fit="hasValue ? 'cover' : 'contain'"
        >
          <div
            v-if="hasValue"
            class="actions fit flex items-center justify-center"
          >
            <q-btn
              icon="mdi-close"
              color="grey-7"
              size="sm"
              unelevated
              round
              @click.stop="clearValue"
            />
          </div>
        </q-img>
      </div>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        @change="onSetFile"
      >
    </q-field>
  </div>
</template>

<script lang="ts">
import { Vue, Model, Prop, Ref, Options } from 'vue-property-decorator';
import { path } from 'ramda';

import previewImage from '@assets/placeholder-image.png';

@Options({
  emits: ['update:model-value'],
})
export default class ImageInput extends Vue {
  @Ref('fileInput') fileInputRef!: HTMLInputElement;

  @Model('modelValue') value!: File;
  @Prop() label!: string;
  @Prop({ default: false }) round!: boolean;
  @Prop({ default: previewImage }) previewImage!: string;
  @Prop() accept!: string;
  @Prop() error!: boolean;
  @Prop() errorMessage!: string;

  get hasValue() {
    return Boolean(this.value);
  }

  get previewValue() {
    if (!this.value) {
      return previewImage;
    }

    return typeof this.value === 'string'
      ? this.value
      : URL.createObjectURL(this.value);
  }

  openFileExplorer() {
    this.fileInputRef.click();
  }

  onSetFile(event: Event) {
    const file = path<File>(['target', 'files', 0], event);

    if (file) {
      this.$emit('update:model-value', file);
    }
  }

  clearValue() {
    this.fileInputRef.value = '';
    this.$emit('update:model-value', null);
  }
}
</script>

<style lang="scss" scoped>
.image-input {
  ::v-deep(.q-field__control-container) {
    padding: 0;
    cursor: pointer;
  }

  &.no-value {
    ::v-deep(.q-field__control) {
      background: #EAEEF1;
      border-radius: $generic-border-radius;
    }
  }

  .actions {
    background: transparent;

    &:hover {
      .q-btn {
        display: flex;
      }
    }

    .q-btn {
      display: none;
    }
  }

  .label {
    font-size: 14px;
    color: #545563;
  }

  .preview {
    margin: 0 auto;

    .q-img {
      border: 1px solid $separator-color;
      border-radius: $generic-border-radius;
      height: 120px;
      width: 120px;

      &.round {
        border-radius: 100rem;
      }
    }
  }
}
</style>
