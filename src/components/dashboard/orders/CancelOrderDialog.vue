<template>
  <q-dialog
    ref="dialogRef"
    @hide="hide"
  >
    <q-card style="width: 560px">
      <q-card-section class="bg-primary">
        <div class="text-white text-h6 text-weight-light">
          {{ $t('dashboard.orders.cancelOrder') }}
        </div>
      </q-card-section>
      <v-form v-slot="{ handleSubmit }">
        <q-form @submit="handleSubmit(cancelOrder)">
          <q-card-section class="q-col-gutter-md">
            <v-field
              v-slot="{ field, handleChange, errorMessage }"
              :label="$t('dashboard.orders.cancelReason')"
              name="reason"
              rules="required"
            >
              <q-input
                :label="$t('dashboard.orders.cancelReason')"
                maxlength="150"
                counter
                autofocus
                :model-value="field.value"
                :error="!!errorMessage"
                :error-message="errorMessage"
                @update:model-value="handleChange"
              />
            </v-field>
          </q-card-section>
          <q-card-section class="flex q-col-gutter-md">
            <div>
              <q-btn
                flat
                :label="$t('common.cancel')"
                @click="hide"
              />
            </div>
            <q-space />
            <div>
              <q-btn
                type="submit"
                unelevated
                color="negative"
                :label="$t('dashboard.orders.cancelOrder')"
              />
            </div>
          </q-card-section>
        </q-form>
      </v-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Prop, Ref } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { QDialog } from 'quasar';

import { IOrder } from '@models/IOrder';

import OrderItems from './OrderItems.vue';

interface ICancelOrderInput {
  reason: string;
}

@Options({
  components: {
    VForm: Form,
    VField: Field,
    OrderItems,
  },
})
export default class CancelOrderDialog extends Vue {
  @Ref('dialogRef') dialogRef!: QDialog;

  @Prop({ required: true }) order!: IOrder;

  reason: string = '';

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  cancelOrder(data: ICancelOrderInput) {
    this.$emit('ok', data.reason);
    this.hide();
  }
}
</script>
