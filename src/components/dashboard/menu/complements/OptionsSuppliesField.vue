<template>
  <div class="q-col-gutter-md">
    <div
      v-for="option, index in options"
      :key="index"
    >
      <div>
        {{ option.label }}
      </div>
      <div>
        <supplies-input
          v-model="option.inventoryItems"
          :inventory-items="inventoryItems.data"
          :loading="inventoryItems.loading"
          @new-inventory-item="onNewInventoryItem"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import { ILoadable } from '@helpers/ILoadable';
import { getInventoryItems } from '@api/inventory';
import { IComplementGroupOption } from '@models/IComplementGroup';
import { IInventoryItem } from '@models/IInventoryItem';

import SuppliesInput from '../product-form/SuppliesInput.vue';

@Options({
  components: {
    SuppliesInput,
  },
})
export default class OptionsSuppliesField extends Vue {
  @Model('modelValue') options!: IComplementGroupOption[];

  inventoryItems: ILoadable<IInventoryItem[]> = {
    loading: false,
    data: [],
  };

  mounted() {
    void this.loadInventoryItems();
  }

  async loadInventoryItems() {
    try {
      this.inventoryItems.loading = true;

      this.inventoryItems.data = await getInventoryItems();
    } finally {
      this.inventoryItems.loading = false;
    }
  }

  onNewInventoryItem(inventoryItem: IInventoryItem) {
    this.inventoryItems.data.push(inventoryItem);
  }
}
</script>
