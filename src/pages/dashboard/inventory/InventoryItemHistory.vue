<template>
  <div
    v-if="inventoryItem.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <basic-side-dialog
    v-else
    class="history-page"
    :class="{ 'empty-history': !hasHistory }"
    :title="$t('dashboard.inventory.changeHistory')"
    @left-action-click="$router.back"
  >
    <template #default>
      <div class="history-content full-width">
        <div class="flex q-pa-md q-col-gutter-md no-wrap items-center">
          <div>
            <div
              class="picture"
              :style="{ backgroundImage: `url(${itemPicture})` }"
            />
          </div>
          <div class="details">
            <div class="label text-bold h-title">
              {{ inventoryItem.data?.label }}
            </div>
            <div class="current-inventory">
              <i18n-t keypath="dashboard.inventory.currentInventory">
                <template #amount>
                  <span class="value">
                    {{ `${itemAmount} ${itemUnit}` }}
                  </span>
                </template>
              </i18n-t>
            </div>
          </div>
        </div>
        <q-separator />
        <div v-if="historyItemsGroups.length > 0">
          <div
            v-for="historyItemGroup, index in historyItemsGroups"
            :key="index"
          >
            <history-item
              :inventory-item="inventoryItem"
              :history-item-group="historyItemGroup"
            />
            <q-separator />
          </div>
        </div>
        <div
          v-else
          class="empty-state flex flex-center q-pa-lg"
        >
          <no-history-item-empty-state />
        </div>
      </div>
    </template>
  </basic-side-dialog>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { pathOr, sortBy, prop, groupWith, reverse } from 'ramda';
import moment from 'moment';

import { getInventoryItem } from '@api/inventory';
import { ILoadable } from '@helpers/ILoadable';
import { IInventoryItem } from '@models/IInventoryItem';
import { IInventoryItemHistory } from '@models/IInventoryItemHistory';

import placeHolderImage from '@assets/placeholder-image.png';
import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import NoHistoryItemEmptyState from '@components/dashboard/inventory/history/NoHistoryItemEmptyState.vue';
import HistoryItem from '@components/dashboard/inventory/history/HistoryItem.vue';

@Options({
  components: {
    BasicSideDialog,
    NoHistoryItemEmptyState,
    HistoryItem,
  },
})
export default class InventoryItemHistory extends Vue {
  inventoryItem: ILoadable<IInventoryItem | null> = {
    loading: false,
    data: null,
  };

  get hasHistory() {
    const history = pathOr([], ['data', 'history'], this.inventoryItem);

    return history.length > 0;
  }

  get itemPicture() {
    return pathOr(placeHolderImage, ['data', 'picture'], this.inventoryItem);
  }

  get itemAmount() {
    return pathOr(0, ['data', 'amount'], this.inventoryItem);
  }

  get itemUnit() {
    const unit = pathOr('unit', ['data', 'unit'], this.inventoryItem);

    return this.$t(`dashboard.inventory.unitsShort.${unit}`);
  }

  get historyItemsGroups() {
    const history = pathOr<IInventoryItemHistory[]>(
      [],
      ['data', 'history'],
      this.inventoryItem,
    );

    const sortedHistory = reverse(
      sortBy(prop('createdAt'), history),
    );

    return groupWith(
      (a: IInventoryItemHistory, b: IInventoryItemHistory) => {
        return Boolean(
          a.orderId &&
          b.orderId &&
          moment(a.createdAt).isSame(moment(b.createdAt), 'day'),
        );
      },
      sortedHistory,
    );
  }

  async mounted() {
    const id = this.$route.params.id as string;

    if (id) {
      await this.loadInventoryItem(id);
    }
  }

  async loadInventoryItem(id: string) {
    try {
      this.inventoryItem.loading = true;

      this.inventoryItem.data = await getInventoryItem(id);
    } finally {
      this.inventoryItem.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.history-page {
  &.empty-history {
    ::v-deep(.q-scrollarea__content) {
      display: flex;
      width: 100%;
    }

    .history-content {
      display: flex;
      flex-direction: column;

      .empty-state {
        flex-grow: 1;
      }
    }
  }

  .picture {
    width: 64px;
    height: 64px;
    border-radius: $generic-border-radius;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .current-inventory {
    font-size: 0.8rem;
    color: $grey-6;

    .value {
      font-weight: bold;
      color: $grey-8;
    }
  }

  .details {
    font-size: 1.6rem;
  }
}
</style>
