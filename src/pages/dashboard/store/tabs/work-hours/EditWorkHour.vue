<template>
  <div
    v-if="editingWorkHour.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <v-form
    v-else
    v-slot="{ handleSubmit, isSubmitting, meta }"
    :initial-values="initialValues"
    class="fit"
  >
    <q-form
      class="fit"
      @submit="handleSubmit(updateWorkHour)"
    >
      <basic-side-dialog
        :title="$t('dashboard.store.workHours.editWorkHour', {
          day: editingDay,
        })"
        @left-action-click="$router.back"
      >
        <template #default>
          <div class="row q-pa-md q-col-gutter-md">
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.workHours.startTime')"
                name="startTime"
                rules="required"
              >
                <select-input
                  :label="$t('dashboard.store.workHours.startTime')"
                  :options="startTimeOptionsFiltered"
                  use-input
                  input-debounce="0"
                  map-options
                  emit-value
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="updateStartTime($event, handleChange)"
                  @filter="filterStartTimeOptions"
                />
              </v-field>
            </div>
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.workHours.endTime')"
                name="endTime"
                rules="required"
              >
                <select-input
                  :label="$t('dashboard.store.workHours.endTime')"
                  :options="endTimeOptionsFiltered"
                  use-input
                  input-debounce="0"
                  map-options
                  emit-value
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="updateEndTime($event, handleChange)"
                  @filter="filterEndTimeOptions"
                />
              </v-field>
            </div>
          </div>
        </template>
        <template #bottom>
          <div class="flex q-pa-md">
            <q-btn
              label="Remover horário"
              color="negative"
              unelevated
              :loading="deleting"
              :disable="isSubmitting"
              @click="deleteWorkHour"
            />
            <q-space />
            <q-btn
              type="submit"
              :label="$t('common.save')"
              color="positive"
              unelevated
              :loading="isSubmitting"
              :disable="!meta.dirty || deleting"
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

import { deleteWorkHour, getWorkHour, updateWorkHour } from '@api/restaurantWorkHours';
import { IWorkHours } from '@models/IWorkHours';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import SelectInput from '@components/form/SelectInput.vue';
import { ILoadable } from '@helpers/ILoadable';

interface WorkHourOption {
  label: string;
  value: number;
}

interface FormData {
  startTime: number;
  endTime: number;
}

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    SelectInput,
  },
})
export default class DeleteCategoryForm extends Vue {
  editingWorkHour: ILoadable<IWorkHours | null> = {
    data: null,
    loading: false,
  };

  deleting: boolean = false;

  startTimeValue: number = 0;
  endTimeValue: number = 1440;

  startTimeOptionsFiltered: WorkHourOption[] = this.timeOptions;
  endTimeOptionsFiltered: WorkHourOption[] = this.timeOptions;

  get initialValues() {
    return this.editingWorkHour.data;
  }

  get workHourId() {
    return this.$route.params.id as string;
  }

  get editingDay() {
    const weekDay = this.editingWorkHour.data?.weekDay;

    if (weekDay === undefined) {
      return '';
    }

    return {
      0: this.$t('common.days.sunday'),
      1: this.$t('common.days.monday'),
      2: this.$t('common.days.tuesday'),
      3: this.$t('common.days.wednesday'),
      4: this.$t('common.days.thursday'),
      5: this.$t('common.days.friday'),
      6: this.$t('common.days.saturday'),
    }[weekDay];
  }

  get timeOptions(): WorkHourOption[] {
    return Array.from(Array(97)).map((_, index) => {
      const value = index * 15;

      return {
        label: this.minutesToHour(value),
        value,
      };
    });
  }

  get startTimeOptions() {
    return this.timeOptions.filter((option) => {
      return option.value < this.endTimeValue;
    });
  }

  get endTimeOptions() {
    return this.timeOptions.filter((option) => {
      return option.value > this.startTimeValue;
    });
  }

  created() {
    void this.loadWorkHour();
  }

  async loadWorkHour() {
    try {
      this.editingWorkHour.loading = true;

      this.editingWorkHour.data = await getWorkHour(this.workHourId);

      this.startTimeValue = this.editingWorkHour.data.startTime;
      this.endTimeValue = this.editingWorkHour.data.endTime;
    } catch (error) {
      void this.$router.push({ name: 'store/work-hours' });
    } finally {
      this.editingWorkHour.loading = false;
    }
  }

  updateStartTime(value: number, handleChange: (value: number) => void) {
    this.startTimeValue = value;
    handleChange(value);
  }

  updateEndTime(value: number, handleChange: (value: number) => void) {
    this.endTimeValue = value || 1440;
    handleChange(value);
  }

  minutesToHour(totalMinutes: number) {
    const hours = (Math.trunc(totalMinutes / 60)).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');

    if (Number(hours) === 24) {
      return '23:59';
    }

    return `${hours}:${minutes}`;
  }

  filterStartTimeOptions(val: string, update: (callback: () => void) => void) {
    if (val === '') {
      update(() => {
        this.startTimeOptionsFiltered = this.startTimeOptions;
      });

      return;
    }

    update(() => {
      const time = val.toLowerCase();

      this.startTimeOptionsFiltered = this.startTimeOptions
        .filter(v => v.label.toLowerCase().indexOf(time) > -1);
    });
  }

  filterEndTimeOptions(val: string, update: (callback: () => void) => void) {
    if (val === '') {
      update(() => {
        this.endTimeOptionsFiltered = this.endTimeOptions;
      });

      return;
    }

    update(() => {
      const time = val.toLowerCase();

      this.endTimeOptionsFiltered = this.endTimeOptions
        .filter(v => v.label.toLowerCase().indexOf(time) > -1);
    });
  }

  async updateWorkHour(formData: FormData) {
    const notifications = 'dashboard.store.workHours.notifications';

    try {
      const { startTime, endTime } = formData;
      const weekDay = this.editingWorkHour.data?.weekDay;

      if (weekDay === undefined) {
        return;
      }

      await updateWorkHour(this.workHourId, { weekDay, startTime, endTime });

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.updateWorkHourSuccess.message`),
      });

      void this.$router.push({ name: 'store/work-hours' });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.updateWorkHourGenericError.message`),
        caption: this.$t(`${notifications}.updateWorkHourGenericError.caption`),
      });
    }
  }

  async deleteWorkHour() {
    const notifications = 'dashboard.store.workHours.notifications';

    try {
      this.deleting = true;

      if (!this.editingWorkHour.data) {
        return;
      }

      await deleteWorkHour(this.editingWorkHour.data);

      void this.$router.push({ name: 'store/work-hours' });

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.deleteWorkHourSuccess.message`),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.deleteWorkHourGenericError.message`),
        caption: this.$t(`${notifications}.deleteWorkHourGenericError.caption`),
      });
    } finally {
      this.deleting = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-size: 14px;
  padding-bottom: 4px;
  color: #545563;
}
</style>
