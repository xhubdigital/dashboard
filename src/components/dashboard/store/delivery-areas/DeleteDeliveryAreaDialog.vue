<template>
  <q-dialog
    ref="dialogRef"
    :persistent="deleting"
    @hide="hide"
  >
    <q-card style="width: 560px">
      <q-card-section class="bg-primary">
        <div class="text-white text-h6 text-weight-light">
          {{ $t('dashboard.store.deliveryAreas.deleteServiceFee') }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        {{ $t('dashboard.store.deliveryAreas.deleteServiceFeeConfirmation') }}
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('common.cancel')"
          :disable="deleting"
          @click="hide"
        />
        <q-space />
        <q-btn
          :label="$t('common.delete')"
          color="negative"
          unelevated
          :loading="deleting"
          @click="deleteServiceFee"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Prop, Ref } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { QDialog } from 'quasar';
import { clone } from 'ramda';

import { IServiceFee } from '@models/IRestaurant';
import { deleteServiceFee } from '@api/restaurantServiceFees';

@Options({
  components: {
    VForm: Form,
    VField: Field,
  },
})
export default class DeleteDeliveryAreaDialog extends Vue {
  clone = clone;

  @Ref('dialogRef') dialogRef!: QDialog;

  @Prop({ required: true }) serviceFee!: IServiceFee;

  deleting: boolean = false;

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  async deleteServiceFee() {
    try {
      this.deleting = true;

      await deleteServiceFee(this.serviceFee);

      this.$emit('ok');
      this.hide();

      this.deleting = false;
    } catch {
      this.deleting = false;
    }
  }
}
</script>
