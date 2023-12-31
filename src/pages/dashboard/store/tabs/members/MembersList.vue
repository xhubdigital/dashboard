<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <div class="row items-center q-col-gutter-md">
        <div class="col flex">
          <text-input
            v-model="filter"
            class="full-width"
            :placeholder="$t('dashboard.store.members.search')"
            autofocus
          >
            <template #append>
              <q-icon name="mdi-magnify" />
            </template>
          </text-input>
        </div>
        <div class="col-auto gt-sm">
          <q-btn
            :label="$t('dashboard.store.members.newMember')"
            color="primary"
            unelevated
            :to="{ name: 'store/members/new' }"
          />
        </div>
        <q-page-sticky
          class="lt-md"
          :offset="[18, 18]"
        >
          <q-btn
            icon="mdi-plus"
            color="primary"
            unelevated
            fab
            :to="{ name: 'store/members/new' }"
          />
        </q-page-sticky>
      </div>
    </div>
    <div class="col-12">
      <q-table
        :columns="columns"
        :rows="filteredMembers"
        :loading="members.loading"
        color="primary"
        flat
        :pagination="{ rowsPerPage: 0 }"
        hide-pagination
      >
        <template #body-cell-actions="props">
          <q-td
            v-bind="props"
            auto-width
          >
            <q-btn
              icon="mdi-dots-horizontal"
              size="md"
              flat
              round
            >
              <q-menu
                anchor="bottom right"
                self="top right"
              >
                <q-list style="min-width: 100px">
                  <q-item
                    v-close-popup
                    clickable
                    @click="editMember(props.row)"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil" />
                    </q-item-section>
                    <q-item-section>{{ $t('common.edit') }}</q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click="deleteMember(props.row)"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-delete" />
                    </q-item-section>
                    <q-item-section>{{ $t('common.delete') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        class="right-side-dialog"
        :model-value="$route.meta.isDialog"
        :position="$q.screen.lt.sm ? 'bottom' : 'right'"
        maximized
        full-height
        no-route-dismiss
        @hide="$router.push('/dashboard/store/members')"
      >
        <div class="content">
          <component :is="Component" />
        </div>
      </q-dialog>
    </router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-property-decorator';
import { RouteLocationNormalized } from 'vue-router';
import { propEq, reject } from 'ramda';

import { ILoadable } from '@helpers/ILoadable';
import { getRestaurantMembers } from '@api/restaurantMembers';
import { IUser } from '@models/IUser';

import TextInput from '@components/form/TextInput.vue';
import DeleteMemberDialog from '@components/dashboard/store/menu/DeleteMemberDialog.vue';

@Options({
  components: {
    TextInput,
  },
})
export default class List extends Vue {
  members: ILoadable<IUser[]> = {
    loading: false,
    data: [],
  };

  filter: string = '';

  get filteredMembers() {
    if (this.filter === '') {
      return this.members.data;
    }

    const filterLowered = this.filter.toLowerCase();

    return this.members.data.filter((member) => {
      const { name, email } = member;

      return name.toLowerCase().indexOf(filterLowered) !== -1 ||
        email.toLowerCase().indexOf(filterLowered) !== -1;
    });
  }

  get columns() {
    return [
      {
        name: 'name',
        label: this.$t('common.name'),
        field: 'name',
        sortable: true,
        align: 'left',
      },
      {
        name: 'email',
        label: this.$t('common.email'),
        field: 'email',
        sortable: true,
        align: 'left',
      },
      {
        name: 'role',
        label: this.$t('dashboard.store.members.userRole'),
        field: 'role',
        format: (role: string) =>
          this.$t(`dashboard.store.members.userRoles.${role}`),
        sortable: true,
        align: 'left',
      },
      {
        name: 'actions',
      },
    ];
  }

  beforeRouteUpdate(to: RouteLocationNormalized) {
    if (to.name === 'store/members') {
      void this.loadMembers();
    }
  }

  created() {
    void this.loadMembers();
  }

  async loadMembers() {
    try {
      this.members.loading = true;

      this.members.data = await getRestaurantMembers();

      this.members.loading = false;
    } catch {
      this.members.loading = false;
    }
  }

  editMember(member: IUser) {
    void this.$router.push({
      name: 'store/members/edit',
      params: { id: member.id },
    });
  }

  deleteMember(member: IUser) {
    this.$q.dialog({
      component: DeleteMemberDialog,
      componentProps: {
        member,
      },
    }).onOk(() => {
      this.members.data = reject(
        propEq('id', member.id),
        this.members.data || [],
      );
    });
  }
}
</script>
