<template>
  <v-form
    v-slot="{ handleSubmit, meta, isSubmitting }"
    :initial-values="clone(serviceFee)"
  >
    <q-form
      class="row q-col-gutter-md"
      @submit="handleSubmit(saveServiceFee)"
    >
      <div class="col-12 header h-title">
        {{ title }}
      </div>
      <div class="col-12">
        <v-field
          v-slot="{ field, handleChange }"
          :label="$t('dashboard.store.deliveryAreas.range')"
          name="range"
          rules="required"
        >
          <div class="label">
            {{ $t('dashboard.store.deliveryAreas.range') }}
          </div>
          <q-item>
            <q-item-section avatar>
              <q-icon
                color="primary"
                name="mdi-map-marker-path"
              />
            </q-item-section>
            <q-item-section>
              <q-slider
                :model-value="field.value"
                :min="0"
                :max="20000"
                :step="500"
                color="primary"
                snap
                label-always
                :label-value="rangeLabel(field.value)"
                switch-label-side
                @update:model-value="onUpdateRange(handleChange, $event)"
              />
            </q-item-section>
          </q-item>
        </v-field>
      </div>
      <div class="col-12">
        <v-field
          v-slot="{ field, handleChange, errorMessage }"
          :label="$t('dashboard.store.deliveryAreas.fee')"
          name="fee"
          rules="required"
        >
          <currency-input
            :label="$t('dashboard.store.deliveryAreas.fee')"
            name="fee"
            :model-value="field.value"
            :error="!!errorMessage"
            :error-message="errorMessage"
            @update:model-value="handleChange"
          />
        </v-field>
      </div>
      <div class="col-6">
        <q-btn
          :label="$t('common.cancel')"
          class="full-width"
          color="grey-6"
          unelevated
          :disable="isSubmitting"
          @click="$emit('cancel')"
        />
      </div>
      <div class="col-6">
        <q-btn
          type="submit"
          :label="$t('common.save')"
          class="full-width"
          color="primary"
          unelevated
          :disable="!meta.dirty"
          :loading="isSubmitting"
        />
      </div>
    </q-form>
  </v-form>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { clone, path } from 'ramda';

import { IServiceFee } from '@models/IRestaurant';
import { saveServiceFee, updateServiceFee } from '@api/restaurantServiceFees';

import CurrencyInput from '@components/form/CurrencyInput.vue';

const notifications = 'dashboard.store.deliveryAreas.notifications';

@Options({
  components: {
    VForm: Form,
    VField: Field,
    CurrencyInput,
  },
})
export default class DeleteCategoryForm extends Vue {
  clone = clone;

  @Prop({ required: true }) serviceFee!: IServiceFee;

  get title() {
    return this.serviceFee.id
      ? this.$t('dashboard.store.deliveryAreas.editingServiceFee')
      : this.$t('dashboard.store.deliveryAreas.creatingServiceFee');
  }

  onUpdateRange(handleChange: (value: number) => void, value: number) {
    handleChange(value);
    this.$emit('updateEditingRange', value);
  }

  async saveServiceFee(serviceFee: IServiceFee) {
    const { id } = serviceFee;

    if (id) {
      await this.updateServiceFee(serviceFee);
    } else {
      await this.saveNewServiceFee(serviceFee);
    }
  }

  async saveNewServiceFee(serviceFee: IServiceFee) {
    const { range, fee } = serviceFee;

    try {
      const newServiceFee = await saveServiceFee({ range, fee });

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.serviceFeeCreated.message`),
      });

      this.$emit('serviceFeeSaved', newServiceFee);
    } catch (error) {
      const errorMessage = path(['response', 'data', 'message'], error);
      const errorKey = errorMessage === 'RANGE_ALREADY_CREATED'
        ? 'rangeUsedError'
        : 'saveGenericError';

      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.${errorKey}.message`),
        caption: this.$t(`${notifications}.${errorKey}.caption`),
      });
    }
  }

  async updateServiceFee(serviceFee: IServiceFee) {
    const { id, range, fee } = serviceFee;

    try {
      const newServiceFee = await updateServiceFee(
        id,
        { range, fee },
      );

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.serviceFeeUpdated.message`),
      });

      this.$emit('serviceFeeSaved', newServiceFee);
    } catch (error) {
      const errorMessage = path(['response', 'data', 'message'], error);
      const errorKey = errorMessage === 'RANGE_ALREADY_CREATED'
        ? 'rangeUsedError'
        : 'updateGenericError';

      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.${errorKey}.message`),
        caption: this.$t(`${notifications}.${errorKey}.caption`),
      });
    }
  }

  metersToKm(meters: number) {
    if (meters === 0) {
      return 'Retirada';
    }

    return this.$n(meters / 1000, 'distance') + ' km';
  }

  rangeLabel(value: number) {
    return this.metersToKm(value);
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 1.2rem;
}

.label {
  font-size: 14px;
  color: #545563;
}

.description {
  font-size: 1.2rem;
  color: $grey-6;
}
</style>
