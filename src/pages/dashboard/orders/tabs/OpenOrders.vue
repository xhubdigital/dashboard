<template>
  <div class="q-col-gutter-lg">
    <div class="flex items-center">
      <div v-if="openOrdersLastUpdated">
        <div>
          {{ $t('dashboard.orders.ordersUpdatedAt') }}
          <span class="text-bold">
            {{ openOrdersLastUpdated.from(now.add(1, 's')) }}
          </span>
        </div>
        <div class="text-bold updated-time">
          {{ openOrdersLastUpdated.format('L LTS') }}
        </div>
      </div>
      <q-space />
      <div>
        <q-toggle
          v-model="_playAudioOnAllPages"
          :label="$t('dashboard.orders.playAudioOnAllPages')"
        />
      </div>
    </div>
    <div>
      <orders-list
        :orders="sortedOrders"
        :hide-status="true"
        @request-update-orders="loadOpenOrders"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { sortBy, prop } from 'ramda';
import { Moment } from 'moment';

import newOrderAudio from '@assets/new-order-audio.mp3';
import { IOrder } from '@models/IOrder';

import OrdersList from '@components/dashboard/orders/OrdersList.vue';

@Options({
  components: {
    OrdersList,
  },
  computed: {
    ...mapGetters('application', ['now']),
    ...mapGetters('orders', [
      'playAudioOnAllPages',
      'loadingOpenOrders',
      'openOrders',
      'pendingOrders',
      'openOrdersLastUpdated',
    ]),
  },
  methods: {
    ...mapActions('orders', [
      'loadOpenOrders',
    ]),
    ...mapMutations('orders', [
      'updatePlayAudioOnAllPages',
    ]),
  },
})
export default class OpenOrders extends Vue {
  loadOpenOrders!: () => Promise<void>;
  updatePlayAudioOnAllPages!: (playOnAllPages: boolean) => void;

  now!: Moment;
  playAudioOnAllPages!: boolean;
  loadingOpenOrders!: boolean;
  openOrders!: IOrder[];
  pendingOrders!: IOrder[];
  openOrdersLastUpdated!: Moment | null;

  audioFile = new Audio(newOrderAudio);

  get sortedOrders() {
    return sortBy(prop('createdAt'), this.openOrders);
  }

  set _playAudioOnAllPages(playOnAllPages: boolean) {
    this.updatePlayAudioOnAllPages(playOnAllPages);
  }

  get _playAudioOnAllPages() {
    return this.playAudioOnAllPages;
  }

  mounted() {
    void this.loadOpenOrders();

    this.audioFile.volume = 1;
    this.audioFile.loop = true;
  }

  unmounted() {
    this.audioFile.pause();
  }

  @Watch('pendingOrders')
  playaudio(pendingOrders: IOrder[]) {
    if (pendingOrders.length > 0 && !this.playAudioOnAllPages) {
      void this.audioFile.play();
    }

    if (pendingOrders.length === 0) {
      this.audioFile.pause();
    }
  }
}
</script>

<style lang="scss" scoped>
.updated-time {
  font-size: 0.7rem;
  color: $grey-6;
}
</style>
