<template>
  <div class="complement-group-list-item">
    <div
      class="header q-pa-lg flex items-center cursor-pointer"
      @click="toggleOpened"
    >
      <div>
        <div class="label h-title">
          {{ groupModel.label }}
        </div>
        <router-link
          class="quantity"
          :to="{
            name: 'menu/complements/connect-products',
            params: { id: groupModel.id }
          }"
          @click.stop
        >
          <q-icon name="mdi-link-variant" />
          {{ $t('dashboard.menu.complementProductsCount', {
            count: productsCount,
          }) }}
        </router-link>
      </div>
      <q-space />
      <div class="flex items-center q-col-gutter-md">
        <div>
          <h-btn-toggle
            :model-value="groupModel.status"
            :options="statusOptions"
            :loading="changingStatus"
            @click.stop
            @update:model-value="changeComplementGroupStatus"
          />
        </div>
        <div>
          <q-btn
            class="open-btn"
            :class="{ 'rotate-180': !opened }"
            icon="mdi-chevron-up"
            color="primary"
            size="lg"
            round
            flat
          />
        </div>
      </div>
    </div>
    <q-slide-transition>
      <div v-show="opened">
        <q-separator />
        <complements-list-item-options
          :options="groupModel.options"
          :complement-group="groupModel"
        />
        <q-separator />
        <div class="flex q-pa-lg q-col-gutter-md">
          <div>
            <q-btn
              :label="$t('dashboard.menu.deleteComplementGroup')"
              color="negative"
              outline
              no-caps
              @click="$emit('request-delete-complement-group', groupModel)"
            />
          </div>
          <q-space />
          <div>
            <q-btn
              :label="$t('dashboard.menu.editComplementGroup')"
              color="primary"
              unelevated
              no-caps
              @click="$emit('request-edit-complement-group', groupModel)"
            />
          </div>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import { IComplementGroup } from '@models/IComplementGroup';
import { updateComplementGroup } from '@api/complementGroups';

import HBtnToggle from '@components/common/HBtnToggle.vue';
import ComplementsListItemOptions from './ComplementsListItemOptions.vue';

@Options({
  components: {
    HBtnToggle,
    ComplementsListItemOptions,
  },
  emits: [
    'request-delete-complement-group',
    'request-edit-complement-group',
  ],
})
export default class ComplementsListItem extends Vue {
  @Model('complementGroup') groupModel!: IComplementGroup;

  opened: boolean = false;
  changingStatus: boolean = false;

  get productsCount() {
    return this.groupModel.connectedProducts.length;
  }

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

  toggleOpened() {
    this.opened = !this.opened;
  }

  async changeComplementGroupStatus(status: boolean) {
    const notifications = 'dashboard.menu.notifications';

    try {
      this.changingStatus = true;

      const { id } = this.groupModel;

      await updateComplementGroup(id, { status });

      this.$emit('update:complementGroup', {
        ...this.groupModel,
        status,
      });

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.updateGroupStatusSuccess.message`),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message:
          this.$t(`${notifications}.updateGroupStatusGenericError.message`),
        caption:
          this.$t(`${notifications}.updateGroupStatusGenericError.caption`),
      });
    } finally {
      this.changingStatus = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.complement-group-list-item {
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;

  .label {
    font-size: 1.2rem;
  }

  .quantity {
    display: flex;
    align-items: center;
    color: black;
    text-decoration: none;

    .q-icon {
      padding-right: 5px;
    }

    &:hover {
      text-decoration: underline;
    }
  }
}

.open-btn {
  transition: transform 0.3s ease;
}
</style>
