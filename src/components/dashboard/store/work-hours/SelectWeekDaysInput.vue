<template>
  <div class="select-week-days-input">
    <div
      v-if="label"
      class="label"
    >
      {{ label }}
    </div>
    <q-field
      v-bind="$props"
      :label="null"
      borderless
    >
      <template #default>
        <div class="flex q-gutter-sm">
          <div
            v-for="_, day in Array(7)"
            :key="day"
          >
            <q-btn
              :label="shortDays[day]"
              color="primary"
              :unelevated="selectedDays[day]"
              :outline="!selectedDays[day]"
              round
              no-caps
              @click="toggleValue(day)"
            />
          </div>
        </div>
      </template>
    </q-field>
  </div>
</template>

<script lang="ts">
import { Vue, Model, Prop, Options } from 'vue-property-decorator';

@Options({
  emits: ['update:model-value'],
})
export default class SelectWeekDaysInput extends Vue {
  @Model('modelValue') value!: number[];
  @Prop() label!: string;
  @Prop() error!: boolean;
  @Prop() errorMessage!: string;
  @Prop() hint!: string;

  get selectedDays(): { [key: number]: boolean } {
    return (this.value || []).reduce((curr, day) => {
      return {
        ...curr,
        [day]: true,
      };
    }, {});
  }

  get shortDays() {
    return [
      this.$t('common.shortDays.sunday'),
      this.$t('common.shortDays.monday'),
      this.$t('common.shortDays.tuesday'),
      this.$t('common.shortDays.wednesday'),
      this.$t('common.shortDays.thursday'),
      this.$t('common.shortDays.friday'),
      this.$t('common.shortDays.saturday'),
    ];
  }

  toggleValue(day: number) {
    if (this.selectedDays[day]) {
      const value = (this.value || []).filter((val) => val !== day);

      this.$emit('update:modelValue', value);

      return;
    }

    this.$emit('update:modelValue', [
      ...(this.value || []),
      day,
    ]);
  }
}
</script>

<style lang="scss" scoped>
.select-week-days-input {
  &::v-deep(.q-field__control-container) {
    padding-top: 12px;
  }

  .label {
    font-size: 14px;
    color: #545563;
  }

  .q-btn {
    ::v-deep(.q-btn__content) {
      font-size: 0.7rem !important;
    }
  }
}
</style>
