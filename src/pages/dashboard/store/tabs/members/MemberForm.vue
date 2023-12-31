<template>
  <div
    v-if="editingMember.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <v-form
    v-else
    v-slot="{ handleSubmit, meta, isSubmitting }"
    class="fit"
    :initial-values="initialValue"
  >
    <q-form
      class="fit"
      @submit="handleSubmit(saveMember)"
    >
      <basic-side-dialog
        :title="title"
        @left-action-click="$router.back"
      >
        <template #default>
          <div class="row q-pa-md q-col-gutter-md">
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('common.name')"
                name="name"
                rules="required"
              >
                <text-input
                  :label="$t('common.name')"
                  autofocus
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('common.email')"
                name="email"
                rules="required"
              >
                <text-input
                  :label="$t('common.email')"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div
              v-if="!editingMember.data"
              class="col-12"
            >
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('common.password')"
                name="password"
                rules="required"
              >
                <text-input
                  :label="$t('common.password')"
                  type="password"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.members.userRole')"
                name="role"
                rules="required"
              >
                <select-input
                  :label="$t('dashboard.store.members.userRole')"
                  :options="rolesOptions"
                  map-options
                  emit-value
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
          </div>
        </template>
        <template #bottom>
          <div class="flex q-pa-md">
            <q-space />
            <q-btn
              type="submit"
              :label="$t('common.save')"
              color="positive"
              unelevated
              :disable="!meta.dirty"
              :loading="isSubmitting"
            />
          </div>
        </template>
      </basic-side-dialog>
    </q-form>
  </v-form>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { path } from 'ramda';

import { ILoadable } from '@helpers/ILoadable';
import { IUser, UserRole } from '@models/IUser';
import { getRestaurantMember, saveRestaurantMember, updateRestaurantMember } from '@api/restaurantMembers';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import TextInput from '@components/form/TextInput.vue';
import SelectInput from '@components/form/SelectInput.vue';

const notifications = 'dashboard.store.members.notifications';

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    TextInput,
    SelectInput,
  },
})
export default class MemberForm extends Vue {
  editingMember: ILoadable<IUser | null> = {
    loading: false,
    data: null,
  };

  get memberId() {
    return this.$route.params.id as string | undefined;
  }

  get title() {
    return this.memberId
      ? this.$t('dashboard.store.members.editMember')
      : this.$t('dashboard.store.members.newMember');
  }

  get initialValue() {
    if (this.editingMember.data) {
      return this.editingMember.data;
    }

    return {
      role: UserRole.Cashier,
    };
  }

  get rolesOptions() {
    return [
      {
        value: UserRole.Admin,
        label: this.$t('dashboard.store.members.userRoles.admin'),
      },
      {
        value: UserRole.Cashier,
        label: this.$t('dashboard.store.members.userRoles.cashier'),
      },
    ];
  }

  created() {
    if (this.memberId) {
      void this.loadMember(this.memberId);
    }
  }

  async loadMember(id: string) {
    try {
      this.editingMember.loading = true;

      this.editingMember.data = await getRestaurantMember(id);
    } finally {
      this.editingMember.loading = false;
    }
  }

  async saveMember(member: IUser) {
    if (this.memberId) {
      await this.updateMember(this.memberId, member);
    } else {
      await this.saveNewMember(member);
    }
  }

  async saveNewMember(member: IUser) {
    try {
      await saveRestaurantMember(member);

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.createMemberSuccess.message`),
      });

      void this.$router.push({ name: 'store/members' });
    } catch (error) {
      const errorDetails = path(['response', 'data', 'message'], error);

      const notification = errorDetails === 'EMAIL_ALREADY_REGISTERED'
        ? 'createMemberEmailAlreadyUsedError'
        : 'createMemberGenericError';

      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.${notification}.message`),
        caption: this.$t(`${notifications}.${notification}.caption`),
      });
    }
  }

  async updateMember(id: string, member: IUser) {
    try {
      await updateRestaurantMember(id, member);

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.updateMemberSuccess.message`),
      });

      void this.$router.push({ name: 'store/members' });
    } catch (error) {
      const errorDetails = path(['response', 'data', 'message'], error);

      const notification = errorDetails === 'EMAIL_ALREADY_REGISTERED'
        ? 'updateMemberEmailAlreadyUsedError'
        : 'updateMemberGenericError';

      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.${notification}.message`),
        caption: this.$t(`${notifications}.${notification}.caption`),
      });
    }
  }
}
</script>
