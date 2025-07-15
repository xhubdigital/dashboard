<template>
  <div class="q-col-gutter-md">
    <div
      v-for="item, index in entityInventoryItems"
      :key="index"
      class="row q-col-gutter-md no-wrap"
    >
      <div class="col-6">
        <select-input
          ref="selectInputs"
          v-model="item.inventoryItemId"
          :placeholder="
            item.inventoryItemId ? null : $t('dashboard.menu.suppliesItem')"
          :options="inventoryItemsFiltered"
          map-options
          emit-value
          use-input
          input-debounce="0"
          :loading="loading"
          @filter="filterInventoryItems"
          @new-value="onNewValue($event, index)"
        >
          <template #no-option="{ inputValue }">
            <q-item
              v-if="inputValue"
              clickable
              @click="onNewValue(inputValue, index)"
            >
              <q-item-section>
                {{ $t('dashboard.menu.createNewSupplyItem', {
                  label: inputValue
                }) }}
              </q-item-section>
            </q-item>
          </template>
        </select-input>
      </div>
      <div class="col-2">
        <number-input
          v-model="item.amount"
          :placeholder="$t('dashboard.menu.suppliesQuantity')"
        />
      </div>
      <div class="col-3">
        <currency-input
          v-model="item.price"
        />
      </div>
      <div class="col-auto">
        <q-btn
          color="negative"
          round
          unelevated
          icon="mdi-delete"
          size="md"
          @click="removeItem(index)"
        />
      </div>
    </div>
    <div class="actions">
      <q-btn
        class="full-width"
        icon="mdi-plus"
        :label="$t('dashboard.menu.addSuppliesOption')"
        color="primary"
        size="sm"
        flat
        @click="addItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop, Model, Ref } from 'vue-property-decorator';
import { QSelect } from 'quasar';

import { saveInventoryItem } from '@api/inventory';
import { IComplementOptionInventoryItem, IInventoryItem, IInventoryItemUnit, IProductInventoryItem } from '@models/IInventoryItem';

import NumberInput from '@components/form/NumberInput.vue';
import SelectInput from '@components/form/SelectInput.vue';
import CurrencyInput from '@components/form/CurrencyInput.vue';

interface ItemSelectOptions {
  value: string;
  label: string;
}

type IInventoryItemAssoc = IProductInventoryItem
  | IComplementOptionInventoryItem;

@Options({
  components: {
    NumberInput,
    SelectInput,
    CurrencyInput,
  },
  emits: ['new-inventory-item'],
})
export default class SuppliesInput extends Vue {
  @Model('modelValue') entityInventoryItems!: Partial<IInventoryItemAssoc>[];
  @Prop({ required: true }) inventoryItems!: IInventoryItem[];
  @Prop({ required: true }) loading!: boolean;
  @Ref('selectInputs') selectInputsRefs!: QSelect[];

  inventoryItemFilter: string = '';

  get inventoryItemsFiltered(): ItemSelectOptions[] {
    const filter = this.inventoryItemFilter.toLowerCase();
    return this.inventoryItemsFormatted.filter((item) => {
      return item.label.toLowerCase().indexOf(filter) !== -1;
    });
  }

  get inventoryItemsFormatted() {
    return this.inventoryItems
      .map((item) => {
        return {
          value: item.id,
          label: item.label,
        };
      });
  }

  mounted() {
    if (this.entityInventoryItems.length === 0) {
      this.entityInventoryItems.push({ amount: 1, price: 0 });
    }
  }

  filterInventoryItems(val: string, update: (callback: () => void) => void) {
    update(() => {
      this.inventoryItemFilter = val;
    });
  }

  removeItem(index: number) {
    this.entityInventoryItems.splice(index, 1);
  }

  addItem() {
    this.entityInventoryItems.push({ amount: 1, price: 0 });
  }

  async onNewValue(itemName: string, index: number) {
    const newInventoryItem = await saveInventoryItem({
      label: itemName,
      unit: IInventoryItemUnit.Unit,
    });

    this.$emit('new-inventory-item', newInventoryItem);

    this.entityInventoryItems[index].inventoryItemId = newInventoryItem.id;
    this.selectInputsRefs[index].blur();
    this.selectInputsRefs[index].hidePopup();
    this.selectInputsRefs[index].updateInputValue('');
  }
}
</script>
