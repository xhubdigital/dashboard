<template>
  <div class="option flex">
    <div class="left">
      <q-badge color="positive" />
      <div class="line" />
    </div>
    <div class="label q-px-md">
      {{ optionModel.label }}
    </div>
    <q-space />
    <div class="actions">
      <h-btn-toggle
        :model-value="optionModel.status"
        :options="statusOptions"
        :loading="changingOptionStatus"
        @click.stop
        @update:model-value="changeComplementGroupOptionStatus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model, Prop } from 'vue-property-decorator';

import { IComplementGroup, IComplementGroupOption } from '@models/IComplementGroup';
import { updateComplementGroupOption } from '@api/complementGroups';

import HBtnToggle from '@components/common/HBtnToggle.vue';

@Options({
  components: {
    HBtnToggle,
  },
})
export default class ComplementsListItemOptionsItem extends Vue {
  @Model('option') optionModel!: IComplementGroupOption;
  @Prop() complementGroup!: IComplementGroup;

  changingOptionStatus: boolean = false;

  get statusOptions() {
    return [
      {
        value: false,
        label: 'Pausado',
      },
      {
        value: true,
        label: 'Ativado',
      },
    ];
  }

  async changeComplementGroupOptionStatus(status: boolean) {
    const notifications = 'dashboard.menu.notifications';

    try {
      this.changingOptionStatus = true;

      const { id } = this.optionModel;
      const { id: groupId } = this.complementGroup;

      if (!id) { return; }

      await updateComplementGroupOption(groupId, id, { status });

      this.$emit('update:option', {
        ...this.optionModel,
        status,
      });

      this.$q.notify({
        type: 'positive',
        message: this.$t(
          `${notifications}.updateGroupOptionStatusSuccess.message`,
        ),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(
          `${notifications}.updateGroupOptionStatusGenericError.message`,
        ),
        caption: this.$t(
          `${notifications}.updateGroupOptionStatusGenericError.caption`,
        ),
      });
    } finally {
      this.changingOptionStatus = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.option {
  .left {
    display: flex;
    flex-direction: column;
    align-items: center;

    .line {
      flex-grow: 1;
      width: 1px;
      background: $grey-4;
    }
  }

  &:not(:last-child) {
    .actions {
      padding-bottom: 48px;
    }
  }

  &:last-child {
    .line {
      display: none;
    }
  }

  .label {
    margin-top: -4px;
  }
}
</style>
