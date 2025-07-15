<template>
  <div
    v-if="restaurant.loading"
    class="q-pa-xl flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <div v-else-if="restaurant.data && !restaurant.data.address">
    <div class="q-pa-none q-pa-md-xl">
      <no-address-empty-state />
    </div>
  </div>
  <div v-else>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-auto">
        <div class="service-fees">
          <div
            v-if="editingServiceFee === null"
            class="q-col-gutter-md"
          >
            <div
              v-for="serviceFee, index in serviceFees"
              :key="index"
            >
              <div
                class="row service-fee flex items-center"
                @mouseover="feeHoveredIndex = index"
                @mouseout="feeHoveredIndex = null"
              >
                <div class="col">
                  <div class="label">
                    {{ $t('dashboard.store.deliveryAreas.range') }}
                  </div>
                  <div class="value">
                    {{ metersToKm(serviceFee.range) }}
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    {{ $t('dashboard.store.deliveryAreas.fee') }}
                  </div>
                  <div class="value">
                    {{ $n(serviceFee.fee, 'currency') }}
                  </div>
                </div>
                <div class="col-auto actions flex q-col-gutter-sm">
                  <div>
                    <q-btn
                      icon="mdi-pencil"
                      size="sm"
                      flat
                      round
                      @click="editServiceFee(serviceFee)"
                    />
                  </div>
                  <div>
                    <q-btn
                      icon="mdi-delete"
                      color="negative"
                      size="sm"
                      flat
                      round
                      @click="deleteServiceFee(serviceFee)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <q-btn
                class="full-width"
                :label="$t('dashboard.store.deliveryAreas.newServiceFee')"
                color="primary"
                outline
                rounded
                @click="newServiceFee"
              />
            </div>
          </div>
          <div v-else>
            <service-fee-form
              :service-fee="editingServiceFee"
              @service-fee-saved="onSaveServiceFee"
              @cancel="onCancelEdit"
              @update-editing-range="onUpdateEditingRange"
            />
          </div>
        </div>
      </div>
      <div class="col">
        <map-viewer
          :restaurant="restaurant.data"
          :service-fees="serviceFees"
          :editing-range="editingRange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { sortBy, prop } from 'ramda';

import { ILoadable } from '@helpers/ILoadable';
import { getUserRestaurant } from '@api/restaurants';
import { IRestaurant, IServiceFee } from '@models/IRestaurant';

import NoAddressEmptyState from '@components/dashboard/store/delivery-areas/NoAddressEmptyState.vue';
import ServiceFeeForm from '@components/dashboard/store/delivery-areas/ServiceFeeForm.vue';
import MapViewer from '@components/dashboard/store/delivery-areas/MapViewer.vue';
import DeleteDeliveryAreaDialog from '@components/dashboard/store/delivery-areas/DeleteDeliveryAreaDialog.vue';

@Options({
  components: {
    NoAddressEmptyState,
    ServiceFeeForm,
    MapViewer,
  },
})
export default class DeliveryAreas extends Vue {
  restaurant: ILoadable<IRestaurant | null> = {
    data: null,
    loading: false,
  };

  feeHoveredIndex: number | null = null;
  editingServiceFee: Partial<IServiceFee> | null = null;

  editingRange: number | null = null;

  get serviceFees() {
    const serviceFees = sortBy(
      prop('range'),
      this.restaurant.data?.serviceFees || [],
    );

    return serviceFees.map((serviceFee, index) => {
      return {
        ...serviceFee,
        hovered: this.feeHoveredIndex === index,
        editing: this.editingServiceFee === serviceFee,
      };
    });
  }

  created() {
    void this.loadRestaurant();
  }

  async loadRestaurant() {
    try {
      this.restaurant.loading = true;

      this.restaurant.data = await getUserRestaurant();
    } finally {
      this.restaurant.loading = false;
    }
  }

  metersToKm(meters: number) {
    if (meters === 0) {
      return 'Retirada';
    }

    return this.$n(meters / 1000, 'distance') + ' km';
  }

  onUpdateEditingRange(range: number) {
    this.editingRange = range;
  }

  newServiceFee() {
    const lastServiceFee = this.serviceFees[this.serviceFees.length - 1];

    const range = lastServiceFee ? lastServiceFee.range : 0;
    const fee = lastServiceFee ? lastServiceFee.fee : 0;

    this.editingRange = range;
    this.editingServiceFee = {
      range,
      fee,
    };
  }

  editServiceFee(serviceFee: IServiceFee) {
    this.editingRange = serviceFee.range;
    this.editingServiceFee = serviceFee;
  }

  onSaveServiceFee(serviceFee: IServiceFee) {
    if (!this.restaurant.data) {
      return;
    }

    if (this.editingServiceFee?.id) {
      const editingIndex = this.restaurant.data.serviceFees.findIndex(
        (serviceFee: IServiceFee) => {
          return serviceFee.id === this.editingServiceFee?.id;
        },
      );

      if (editingIndex) {
        this.restaurant.data.serviceFees[editingIndex] = serviceFee;
      }
    } else {
      this.restaurant.data.serviceFees.push(serviceFee);
    }

    this.editingServiceFee = null;
    this.editingRange = null;
  }

  onCancelEdit() {
    this.editingServiceFee = null;
    this.editingRange = null;
  }

  deleteServiceFee(serviceFee: IServiceFee) {
    this.$q.dialog({
      component: DeleteDeliveryAreaDialog,
      componentProps: { serviceFee },
    }).onOk(() => {
      if (!this.restaurant.data) {
        return;
      }

      this.restaurant.data.serviceFees = this.restaurant.data.serviceFees
        .filter((_serviceFee: IServiceFee) => {
          return _serviceFee.id !== serviceFee.id;
        });
    });
  }
}
</script>

<style lang="scss" scoped>
.service-fee {
  min-width: 330px;
}

.service-fee {
  padding: 8px 12px 8px 18px;
  border-radius: 10rem;
  border: 1px solid $grey-5;
  cursor: pointer;

  &:hover {
    background: $grey-2;
  }

  .label {
    font-size: 0.7rem;
    color: $grey-6;
  }

  .value {
    font-weight: bold;
  }
}
</style>
