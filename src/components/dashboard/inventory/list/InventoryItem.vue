<template>
  <div class="inventory-item q-pa-md">
    <div class="flex items-center q-col-gutter-md">
      <div>
        <div
          class="picture"
          :style="{ backgroundImage: `url(${itemPicture})` }"
        />
      </div>
      <div class="label">
        {{ inventoryItem.label }}
      </div>
      <q-space />
      <div class="amount">
        <div class="label">
          {{ $t('dashboard.inventory.amount') }}
        </div>
        <div class="value">
          {{ $n(itemAmount, 'inventoryAmount') }} {{ itemUnit }}
        </div>
      </div>
      <div class="actions">
        <q-btn
          icon="mdi-dots-horizontal"
          size="md"
          flat
          round
        >
          <q-menu
            anchor="bottom right"
            self="top right"
          >
            <q-list style="min-width: 100px">
              <q-item
                v-close-popup
                clickable
                @click="$emit('request-edit-item', inventoryItem)"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-pencil" />
                </q-item-section>
                <q-item-section>{{ $t('common.edit') }}</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="$emit('request-change-amount', inventoryItem)"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-archive-arrow-down" />
                </q-item-section>
                <q-item-section>
                  {{ $t('dashboard.inventory.changeAmount') }}
                </q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="$emit('request-open-history', inventoryItem)"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-clipboard-text-clock" />
                </q-item-section>
                <q-item-section>
                  {{ $t('dashboard.inventory.changeHistory') }}
                </q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="$emit('request-delete-item', inventoryItem)"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-delete" />
                </q-item-section>
                <q-item-section>{{ $t('common.delete') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IInventoryItem } from '@models/IInventoryItem';

import placeHolderImage from '@assets/placeholder-image.png';

@Options({})
export default class CategoriesListItem extends Vue {
  @Prop({ required: true }) inventoryItem!: IInventoryItem;

  get itemPicture() {
    const { picture } = this.inventoryItem;

    return picture ? picture : placeHolderImage;
  }

  get itemAmount() {
    const { amount } = this.inventoryItem;
    return amount;
  }

  get itemUnit() {
    const { unit } = this.inventoryItem;

    return this.$t(`dashboard.inventory.unitsShort.${unit}`);
  }
}
</script>

<style lang="scss" scoped>
.inventory-item {
  min-width: 600px;
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;

  .label {
    font-size: 1.2rem;
  }

  .picture {
    width: 64px;
    height: 64px;
    border-radius: $generic-border-radius;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .label {
    font-weight: bold;
  }

  .amount {
    text-align: right;

    .label {
      font-size: 0.8rem;
      font-weight: 100;
      color: $grey-8
    }

    .value {
      line-height: 1.2rem;
      font-size: 1.4rem;
      font-weight: bold;
    }
  }
}
</style>
