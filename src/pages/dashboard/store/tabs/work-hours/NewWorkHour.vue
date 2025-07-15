<template>
  <v-form
    v-slot="{ handleSubmit, isSubmitting }"
    class="fit"
  >
    <q-form
      class="fit"
      @submit="handleSubmit(saveNewWorkHour)"
    >
      <basic-side-dialog
        :title="$t('dashboard.store.workHours.newWorkHour')"
        @left-action-click="$router.back"
      >
        <template #default>
          <div class="row q-pa-md q-col-gutter-md">
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.workHours.weekDays')"
                name="weekDays"
                rules="required"
              >
                <select-week-days-input
                  :label="$t('dashboard.store.workHours.weekDays')"
                  :hint="$t('dashboard.store.workHours.weekDaysHint')"
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
            <q-space />
            <q-btn
              type="submit"
              :label="$t('common.save')"
              color="positive"
              unelevated
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

import { saveWorkHour } from '@api/restaurantWorkHours';
import { IWorkHours } from '@models/IWorkHours';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import SelectWeekDaysInput from '@components/dashboard/store/work-hours/SelectWeekDaysInput.vue';
import SelectInput from '@components/form/SelectInput.vue';

interface WorkHourOption {
  label: string;
  value: number;
}

interface FormData {
  weekDays: number[];
  startTime: number;
  endTime: number;
}

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    SelectWeekDaysInput,
    SelectInput,
  },
})
export default class DeleteCategoryForm extends Vue {
  startTimeValue: number = 0;
  endTimeValue: number = 1440;

  startTimeOptionsFiltered: WorkHourOption[] = [];
  endTimeOptionsFiltered: WorkHourOption[] = [];

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

  async saveNewWorkHour(formData: FormData) {
    const notifications = 'dashboard.store.workHours.notifications';

    try {
      const { weekDays, startTime, endTime } = formData;

      await Promise.all(
        weekDays.map((weekDay) => {
          return saveWorkHour({ weekDay, startTime, endTime });
        }),
      );

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.createWorkHourSuccess.message`),
      });

      void this.$router.push({ name: 'store/work-hours' });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.createWorkHourGenericError.message`),
        caption: this.$t(`${notifications}.createWorkHourGenericError.caption`),
      });
    }
  }

  getWorkHoursByDay(workHours: IWorkHours[], weekDay: number) {
    return workHours.filter((workHour) => {
      return workHour.weekDay === weekDay;
    });
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
