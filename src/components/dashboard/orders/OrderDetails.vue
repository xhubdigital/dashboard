<template>
  <q-dialog
    ref="dialogRef"
    :persistent="saving"
    @hide="hide"
  >
    <q-card style="width: 560px">
      <q-card-section class="bg-primary flex">
        <div class="text-white text-h6 text-weight-light">
          {{ $t('dashboard.orders.orderDetails') }}
        </div>
        <q-space />
        <q-btn
          icon="mdi-printer"
          color="white"
          text-color="primary"
          size="sm"
          round
          unelevated
          :to="`/receipt/${order.id}`"
          target="_blank"
        >
          <q-tooltip
            anchor="bottom middle"
            self="top middle"
            :offset="[6, 6]"
          >
            {{ $t('common.print') }}
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section class="q-col-gutter-md">
        <div class="title">
          {{ $t('dashboard.orders.items') }}
        </div>
        <order-items :order="order" />
        <div>
          <q-separator />
        </div>
        <div class="info-list">
          <div class="item">
            <div class="field">
              {{ $t('dashboard.orders.orderSubTotal') }}
            </div>
            <div class="value">
              {{ $n(subTotal, 'currency') }}
            </div>
          </div>
          <div class="item">
            <div class="field">
              {{ $t('dashboard.orders.orderServiceFee') }}
            </div>
            <div class="value">
              {{ $n(serviceFee || 0, 'currency') }}
            </div>
          </div>
          <div class="item">
            <div class="field">
              {{ $t('dashboard.orders.orderTotal') }}
            </div>
            <div class="value">
              {{ $n(total, 'currency') }}
            </div>
          </div>
        </div>
        <div>
          <q-separator />
        </div>
        <div>
          <div class="title">
            {{ $t('dashboard.orders.info') }}
          </div>
        </div>
        <div class="info-list">
          <div class="item">
            <div class="field">
              {{ $t('dashboard.orders.orderUserName') }}
            </div>
            <div class="value">
              {{ userName }}
            </div>
          </div>
          <div class="item">
            <div class="field">
              {{ $t('dashboard.orders.orderUserPhone') }}
            </div>
            <div class="value">
              {{ userPhone }}
            </div>
          </div>
          <div class="item">
            <div class="field">
              {{ $t('dashboard.orders.orderPaymentType') }}
            </div>
            <div class="value">
              {{ paymentType }}
            </div>
          </div>
          <div class="item">
            <div class="field">
              {{ $t('dashboard.orders.orderType') }}
            </div>
            <div class="value">
              {{ orderType }}
            </div>
          </div>
        </div>
        <template v-if="isDelivery">
          <div>
            <q-separator />
          </div>
          <div>
            <div class="title">
              {{ $t('dashboard.orders.address') }}
            </div>
          </div>
          <div>
            <div>
              {{ address }}
            </div>
          </div>
        </template>
      </q-card-section>
      <q-separator />
      <q-card-section class="flex q-col-gutter-md">
        <div>
          <q-btn
            flat
            :label="$t('common.back')"
            @click="hide"
          />
        </div>
        <q-space />
        <template v-if="!isOrderEnded">
          <div>
            <q-btn
              unelevated
              color="negative"
              :label="$t('dashboard.orders.cancelOrder')"
              :loading="saving"
              @click="requestCancelOrder"
            />
          </div>
          <div>
            <q-btn
              unelevated
              color="positive"
              :label="orderActionLabel"
              :loading="saving"
              @click="sendToNextStatus"
            />
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Prop, Ref } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { QDialog } from 'quasar';
import { path, pathOr } from 'ramda';

import {
  IOrder,
  IOrderPaymentInfoType,
  IOrderStatus,
  IOrderType,
} from '@models/IOrder';
import { formatAddress } from '@helpers/format/formatAddress';
import { formatPhone } from '@helpers/format/formatPhone';
import { updateOrderStatus } from '@api/orders';

import OrderItems from './OrderItems.vue';
import CancelOrderDialog from './CancelOrderDialog.vue';

@Options({
  components: {
    VForm: Form,
    VField: Field,
    OrderItems,
  },
})
export default class OrderDetails extends Vue {
  @Ref('dialogRef') dialogRef!: QDialog;

  @Prop({ required: true }) order!: IOrder;

  saving: boolean = false;

  get isDelivery() {
    return this.order.type === IOrderType.Delivery;
  }

  get paymentType() {
    const { paymentInfo: { type } } = this.order;

    return {
      [IOrderPaymentInfoType.CreditCardOnDelivery]:
        this.$t('common.creditCard'),
      [IOrderPaymentInfoType.DebitCardOnDelivery]: this.$t('common.debitCard'),
      [IOrderPaymentInfoType.MoneyOnDelivery]: this.getMoneyPaymentInfo(),
    }[type];
  }

  get orderType() {
    const { type } = this.order;

    return {
      [IOrderType.Delivery]: this.$t('common.delivery'),
      [IOrderType.Takeout]: this.$t('common.takeout'),
      [IOrderType.Local]: this.$t('common.consumeOnLocal'),
    }[type];
  }

  get orderActionLabel() {
    const { status } = this.order;

    return {
      [IOrderStatus.Pending]: this.$t('dashboard.orders.approveOrder'),
      [IOrderStatus.Production]: this.$t('dashboard.orders.readyToDeliver'),
      [IOrderStatus.Delivery]: this.$t('dashboard.orders.finishOrder'),
      [IOrderStatus.Cancelled]: this.$t('dashboard.orders.finishOrder'),
      [IOrderStatus.Done]: this.$t('dashboard.orders.finishOrder'),
    }[status];
  }

  get isOrderEnded() {
    const { status } = this.order;

    return status === IOrderStatus.Done || status === IOrderStatus.Cancelled;
  }

  get subTotal() {
    return this.order.subTotal;
  }

  get serviceFee() {
    return this.order.serviceFee;
  }

  get total() {
    return this.subTotal + this.serviceFee;
  }

  get userName() {
    return pathOr(this.order.userName, ['client', 'name'], this.order);
  }

  get userPhone() {
    const phone = path<string>(['client', 'phone'], this.order);

    return phone ? formatPhone(phone) : this.order.userPhone;
  }

  get address() {
    const { address } = this.order;

    return formatAddress(address);
  }

  get nextStatus() {
    const { status } = this.order;

    return {
      [IOrderStatus.Pending]: IOrderStatus.Production,
      [IOrderStatus.Production]: IOrderStatus.Delivery,
      [IOrderStatus.Delivery]: IOrderStatus.Done,
      [IOrderStatus.Cancelled]: IOrderStatus.Cancelled,
      [IOrderStatus.Done]: IOrderStatus.Done,
    }[status];
  }

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  getMoneyPaymentInfo() {
    const { paymentInfo } = this.order;
    const { changeFor } = paymentInfo;

    return changeFor
      ? this.$t('dashboard.orders.paymentMoneyWithChange', {
        change: this.$n(changeFor, 'currency'),
      })
      : this.$t('dashboard.orders.paymentMoneyWithoutChange');
  }

  requestCancelOrder() {
    this.$q.dialog({
      component: CancelOrderDialog,
      componentProps: { order: this.order },
    }).onOk((reason: string) => void this.cancelOrder(reason));
  }

  async cancelOrder(reason: string) {
    try {
      this.saving = true;

      const order = await updateOrderStatus(
        this.order.id,
        IOrderStatus.Cancelled,
        reason,
      );

      this.$emit('ok', order);
      this.hide();

      this.saving = false;
    } catch (error) {
      this.saving = false;
    }
  }

  async sendToNextStatus() {
    try {
      this.saving = true;

      const order = await updateOrderStatus(this.order.id, this.nextStatus);

      this.$emit('ok', order);
      this.hide();

      this.saving = false;
    } catch (error) {
      this.saving = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.2rem;
  font-weight: 100;
}

.info-list {
  .item {
    display: flex;

    .field {
      font-weight: 300;
      padding-right: 12px;
    }

    .value {
      font-weight: 900;
      margin-left: auto;
    }
  }
}
</style>
