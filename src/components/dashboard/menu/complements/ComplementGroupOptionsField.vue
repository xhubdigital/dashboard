<template>
  <div class="complement-group-options-field">
    <vue-draggable
      v-model="options"
      class="q-gutter-md q-pb-md"
      item-key="id"
    >
      <template #item="{ index }">
        <div>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-auto flex flex-center">
              <q-icon
                class="handle"
                size="xs"
                name="mdi-drag-vertical"
              />
            </div>
            <div class="col">
              <text-input
                v-model="options[index].label"
              />
            </div>
            <div class="col-3">
              <currency-input
                v-model="options[index].price"
              />
            </div>
            <div class="col-auto">
              <q-btn
                round
                color="negative"
                unelevated
                icon="mdi-delete"
                size="sm"
                @click="removeOption(index)"
              />
            </div>
          </div>
        </div>
      </template>
    </vue-draggable>
    <div>
      <q-btn
        class="full-width"
        icon="mdi-plus"
        :label="$t('dashboard.menu.addOption')"
        color="primary"
        size="sm"
        flat
        @click="addOption"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';
import VueDraggable from 'vuedraggable';

import { IComplementGroupOption } from '@models/IComplementGroup';

import TextInput from '@components/form/TextInput.vue';
import CurrencyInput from '@components/form/CurrencyInput.vue';

@Options({
  components: {
    VueDraggable,
    TextInput,
    CurrencyInput,
  },
})
export default class ComplementGroupForm extends Vue {
  @Model('modelValue') options!: IComplementGroupOption[];

  addOption() {
    this.options.push({
      label: '',
      price: 0,
      position: this.options.length,
      inventoryItems: [],
    });
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.handle {
  cursor: move;
}

.sortable-ghost {
  opacity: 0.4;
}
</style>
