<template>
  <q-dialog
    ref="dialogRef"
    :persistent="deleting"
    @hide="hide"
  >
    <q-card style="width: 560px">
      <q-card-section class="bg-primary">
        <div class="text-white text-h6 text-weight-light">
          {{ $t('dashboard.store.members.deleteMember') }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        {{ $t('dashboard.store.members.deleteMemberConfirmation') }}
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
          @click="deleteMember"
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

import { deleteRestaurantMember } from '@api/restaurantMembers';
import { IUser } from '@models/IUser';

const notifications = 'dashboard.store.members.notifications';

@Options({
  components: {
    VForm: Form,
    VField: Field,
  },
})
export default class DeleteMemberDialog extends Vue {
  clone = clone;

  @Ref('dialogRef') dialogRef!: QDialog;

  @Prop({ required: true }) member!: IUser;

  deleting: boolean = false;

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  async deleteMember() {
    try {
      this.deleting = true;

      await deleteRestaurantMember(this.member);

      this.$emit('ok');
      this.hide();

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.deleteMemberSuccess.message`),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.deleteMemberGenericError.message`),
        caption: this.$t(`${notifications}.deleteMemberGenericError.caption`),
      });
    } finally {
      this.deleting = false;
    }
  }
}
</script>
