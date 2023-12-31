<template>
  <div class="history-item flex items-center no-wrap q-col-gutter-md">
    <div>
      <div>
        <template v-if="historyItemGroup[0].orderId">
          <i18n-t keypath="dashboard.inventory.updatedByOrders">
            <template #orders>
              <span class="text-bold">
                {{ $t('dashboard.inventory.updatedByOrdersCount', {
                  count: historyItemGroup.length,
                }) }}
              </span>
            </template>
          </i18n-t>
        </template>
        <template v-else>
          <i18n-t keypath="dashboard.inventory.updatedByUser">
            <template #user>
              <span class="text-bold">
                {{ historyItemGroup[0].user?.name }}
              </span>
            </template>
          </i18n-t>
        </template>
      </div>
      <div>
        {{ lastItemFormattedDate }}
      </div>
    </div>
    <q-space class="q-pa-none" />
    <div>
      <div
        class="variation"
        :class="{
          negative: changeFromItems < 0,
          positive: changeFromItems >= 0,
        }"
      >
        {{ changeFromItems }} {{ itemUnit }}
      </div>
      <div class="old-amount">
        {{ firstOldValueFromItems }} {{ itemUnit }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { prop, last, sum, map, pathOr } from 'ramda';
import moment from 'moment';

import { IInventoryItem } from '@models/IInventoryItem';
import { IInventoryItemHistory } from '@models/IInventoryItemHistory';

@Options({})
export default class HistoryItem extends Vue {
  @Prop({ required: true }) inventoryItem!: IInventoryItem;
  @Prop({ required: true }) historyItemGroup!: IInventoryItemHistory[];

  get lastItemFormattedDate() {
    const item = last(this.historyItemGroup);
    const withHour = !item?.orderId;

    return moment(item?.createdAt).format(withHour ? 'lll' : 'll');
  }

  get changeFromItems() {
    return sum(map(prop('variation'), this.historyItemGroup));
  }

  get firstOldValueFromItems() {
    const item = last(this.historyItemGroup);

    return item?.oldAmount;
  }

  get itemUnit() {
    const unit = pathOr('unit', ['data', 'unit'], this.inventoryItem);

    return this.$t(`dashboard.inventory.unitsShort.${unit}`);
  }
}
</script>

<style lang="scss" scoped>
.history-item {
  padding: 8px 16px;

  .variation {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;

    &.positive {
      color: $positive;
    }

    &.negative {
      color: $negative;
    }
  }

  .old-amount {
    text-align: right;
    color: $grey-6;
  }
}
</style>
