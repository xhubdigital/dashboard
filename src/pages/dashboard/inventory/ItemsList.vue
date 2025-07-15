<template>
  <q-page class="flex">
    <div class="items-list column container q-col-gutter-md">
      <div class="h-title">
        {{ $t('dashboard.inventory.title') }}
      </div>
      <div v-if="inventoryItems.data.length > 0">
        <div class="q-col-gutter-md">
          <div>
            <inventory-items-list-header />
          </div>
          <div class="q-col-gutter-md">
            <div
              v-for="item in sortedInventoryItems"
              :key="item.id"
            >
              <inventory-item
                :inventory-item="item"
                @request-edit-item="openEditItemPage"
                @request-change-amount="openChangeAmountPage"
                @request-open-history="openChangeHistoryPage"
                @request-delete-item="openDeleteItemDialog"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="col-grow flex flex-center"
      >
        <template v-if="noItems">
          <no-inventory-item-empty-state />
        </template>
        <template v-else-if="inventoryItems.loading">
          <q-spinner
            color="primary"
            size="80px"
          />
        </template>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        class="right-side-dialog"
        :model-value="$route.meta.isDialog"
        :position="$q.screen.lt.sm ? 'bottom' : 'right'"
        maximized
        full-height
        no-route-dismiss
        @hide="$router.push('/dashboard/inventory')"
      >
        <div class="content">
          <component :is="Component" />
        </div>
      </q-dialog>
    </router-view>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { RouteLocationNormalized } from 'vue-router';
import { prop, propEq, reject, sortBy } from 'ramda';

import { getInventoryItems } from '@api/inventory';
import { ILoadable } from '@helpers/ILoadable';
import { IInventoryItem } from '@models/IInventoryItem';

import InventoryItemsListHeader from '@components/dashboard/inventory/list/InventoryItemsListHeader.vue';
import NoInventoryItemEmptyState from '@components/dashboard/inventory/list/NoInventoryItemEmptyState.vue';
import InventoryItem from '@components/dashboard/inventory/list/InventoryItem.vue';
import DeleteInventoryItemDialog from '@components/dashboard/inventory/list/DeleteInventoryItemDialog.vue';

@Options({
  components: {
    InventoryItemsListHeader,
    NoInventoryItemEmptyState,
    InventoryItem,
  },
})
export default class ItemsList extends Vue {
  inventoryItems: ILoadable<IInventoryItem[]> = {
    loading: false,
    data: [],
  };

  get noItems() {
    return this.inventoryItems.data.length === 0 &&
      this.inventoryItems.loading === false;
  }

  get sortedInventoryItems() {
    return sortBy(prop('label'), this.inventoryItems.data);
  }

  beforeRouteUpdate(to: RouteLocationNormalized) {
    if (to.name === 'inventory/list') {
      void this.loadInventoryItems();
    }
  }

  created() {
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

  openEditItemPage(item: IInventoryItem) {
    const { id } = item;

    void this.$router.push({
      name: 'inventory/edit-item',
      params: { id },
    });
  }

  openChangeAmountPage(item: IInventoryItem) {
    const { id } = item;

    void this.$router.push({
      name: 'inventory/change-amount',
      params: { id },
    });
  }

  openChangeHistoryPage(item: IInventoryItem) {
    const { id } = item;

    void this.$router.push({
      name: 'inventory/change-history',
      params: { id },
    });
  }

  openDeleteItemDialog(inventoryItem: IInventoryItem) {
    const notifications = 'dashboard.inventory.notifications';

    this.$q.dialog({
      component: DeleteInventoryItemDialog,
      componentProps: {
        inventoryItem,
      },
    }).onOk(() => {
      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.deleteInventoryItemSuccess.message`),
      });

      this.inventoryItems.data = reject(
        propEq('id', inventoryItem.id),
        this.inventoryItems.data || [],
      );
    });
  }
}
</script>

<style lang="scss" scoped>
.items-list {
  flex-grow: 1;
}

.h-title {
  font-size: 24px;
}
</style>
