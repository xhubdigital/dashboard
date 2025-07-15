<template>
  <q-dialog
    ref="dialogRef"
    :persistent="deleting"
    @hide="hide"
  >
    <q-card style="width: 560px">
      <v-form
        v-slot="{ handleSubmit }"
        :initial-values="clone(category)"
      >
        <q-form @submit="handleSubmit(deleteCategory)">
          <q-card-section class="bg-primary">
            <div class="text-white text-h6 text-weight-light">
              {{ $t('dashboard.menu.deleteCategory') }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            {{ $t('dashboard.menu.deleteCategoryConfirmation') }}
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
              type="submit"
              :label="$t('common.delete')"
              color="negative"
              unelevated
              :loading="deleting"
            />
          </q-card-actions>
        </q-form>
      </v-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Prop, Ref } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { QDialog } from 'quasar';
import { clone } from 'ramda';

import { deleteProductCategory } from '@api/productCategories';
import { IProductCategory } from '@models/IProductCategory';

@Options({
  components: {
    VForm: Form,
    VField: Field,
  },
})
export default class DeleteCategoryForm extends Vue {
  clone = clone;

  @Ref('dialogRef') dialogRef!: QDialog;

  @Prop() category!: IProductCategory;

  deleting: boolean = false;

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  async deleteCategory(value: IProductCategory) {
    try {
      this.deleting = true;

      await deleteProductCategory(value);

      this.$emit('ok');
      this.hide();

      this.deleting = false;
    } catch {
      this.deleting = false;
    }
  }
}
</script>
