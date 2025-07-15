<template>
  <div>
    <div
      v-if="complementGroups.loading"
      class="q-col-gutter-md"
    >
      <div>
        <q-skeleton height="80px" />
      </div>
      <div>
        <q-skeleton height="80px" />
      </div>
      <div>
        <q-skeleton height="80px" />
      </div>
      <div>
        <q-skeleton height="80px" />
      </div>
    </div>
    <div
      v-else
      class="q-col-gutter-md"
    >
      <div>
        <complements-header
          :complement-groups="complementGroups.data"
        />
      </div>
      <div>
        <complements-list
          v-model:complement-groups="complementGroups.data"
          @request-delete-complement-group="openDeleteComplementGroupDialog"
          @request-edit-complement-group="openComplementGroupDialog"
        />
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        class="right-side-dialog"
        :model-value="$route.meta.isDialog"
        :position="$q.screen.lt.sm ? 'bottom' : 'right'"
        maximized
        full-height
        no-route-dismiss
        @hide="$router.push('/dashboard/menu/complements')"
      >
        <div class="content">
          <component :is="Component" />
        </div>
      </q-dialog>
    </router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { RouteLocationNormalized } from 'vue-router';
import { propEq, reject, sortBy, prop } from 'ramda';

import { ILoadable } from '@helpers/ILoadable';
import { IComplementGroup } from '@models/IComplementGroup';
import { getComplementGroups } from '@api/complementGroups';

import ComplementsHeader from '@components/dashboard/menu/ComplementsHeader.vue';
import ComplementsList from '@components/dashboard/menu/complements/ComplementsList.vue';
import DeleteComplementGroupDialog from '@components/dashboard/menu/complements/DeleteComplementGroupDialog.vue';

@Options({
  components: {
    ComplementsHeader,
    ComplementsList,
  },
})
export default class Complements extends Vue {
  complementGroups: ILoadable<IComplementGroup[]> = {
    loading: false,
    data: [],
  };

  beforeRouteUpdate(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ) {
    if (to.name === 'menu/complements' ||
      from.name === 'menu/complements/add-product'
    ) {
      void this.loadComplementGroups();
    }
  }

  created() {
    void this.loadComplementGroups();
  }

  async loadComplementGroups() {
    try {
      this.complementGroups.loading = true;

      const complementGroups = await getComplementGroups();

      this.complementGroups.data = sortBy(prop('label'), complementGroups);
    } finally {
      this.complementGroups.loading = false;
    }
  }

  openDeleteComplementGroupDialog(complementGroup: IComplementGroup) {
    this.$q.dialog({
      component: DeleteComplementGroupDialog,
      componentProps: {
        complementGroup,
      },
    }).onOk(() => {
      this.complementGroups.data = reject(
        propEq('id', complementGroup.id),
        this.complementGroups.data || [],
      );
    });
  }

  openComplementGroupDialog(complementGroup: IComplementGroup) {
    const { id } = complementGroup;

    void this.$router.push({
      name: 'menu/complements/edit-group',
      params: { id },
    });
  }
}
</script>

