<template>
  <q-list class="menu-items h-title q-pa-md q-gutter-md">
    <q-item
      v-for="item in links"
      :key="item.link"
      :to="item.link"
      :exact="item.exact"
      class="menu-link"
    >
      <q-item-section avatar>
        <q-avatar rounded>
          <q-icon :name="item.icon" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="menu-title">
          {{ item.title }}
        </q-item-label>
        <q-item-label caption>
          {{ item.caption }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class MainLayout extends Vue {
  get links() {
    return [
      // {
      //   title: 'Dashboard',
      //   icon: 'mdi-view-dashboard',
      //   link: '/dashboard',
      //   exact: true,
      // },
      {
        title: 'Loja',
        caption: 'Perfil da sua loja',
        icon: 'mdi-store-outline',
        link: '/dashboard/store',
      },
      {
        title: 'Clientes',
        caption: 'Clientes',
        icon: 'mdi-account-multiple-outline',
        link: '/dashboard/clients',
      },
      {
        title: 'Pedidos',
        caption: 'Acompanhamento de pedidos',
        icon: 'mdi-clipboard-text-outline',
        link: '/dashboard/orders',
      },
      {
        title: 'Catálogo',
        caption: 'Configuração do catálogo',
        icon: 'mdi-clipboard-text-multiple-outline',
        link: '/dashboard/menu',
      },
      {
        title: 'Estoque',
        caption: 'Controle seu estoque',
        icon: 'mdi-archive-outline',
        link: '/dashboard/inventory',
      },
      // {
      //   title: 'Financeiro',
      //   caption: 'Gerenciamento financeiro',
      //   icon: 'mdi-cash-usd-outline',
      //   link: '/dashboard/x',
      // },
      // {
      //   title: 'Horários',
      //   caption: 'Horários de funcionamento',
      //   icon: 'mdi-alarm',
      //   link: '/dashboard/x',
      // },
      // {
      //   title: 'Áreas de entrega',
      //   caption: 'Configure sua área de entrega',
      //   icon: 'mdi-map-marker-outline',
      //   link: '/dashboard/x',
      // },
      {
        title: 'Políticas',
        caption: 'Termos e condições',
        icon: 'mdi-checkbox-multiple-marked-outline',
        link: '/dashboard/policies',
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.menu-link {
  border-radius: $generic-border-radius;
  font-size: 18px;
  color: $dark;
  padding: 15px;
  box-shadow: 0 0 0 1px $separator-color;

  ::v-deep(.q-focus-helper) {
    visibility: hidden;
  }

  .q-avatar {
    color: #83859C;
    background: #EDEEF2;
  }

  .menu-title{
    font-size: 18px;
  }

  .text-caption {
    font-size: 13px;
  }

  &.q-router-link--active {
    box-shadow: 0 0 0 2px $primary;
    // background: rgba(255, 87, 34, 0.1);

    .q-avatar {
      color: #FFF;
      background: $primary;
    }
  }

  &:hover {
    box-shadow: 0 0 0 2px $primary;
  }
}
</style>
