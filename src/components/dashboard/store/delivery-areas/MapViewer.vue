<template>
  <GMapMap
    :center="center"
    :zoom="14"
    :options="mapOptions"
    style="width: 100%; height: 600px"
  >
    <GMapCircle
      v-for="serviceFee in serviceFees"
      :key="serviceFee.id"
      :options="{
        ...defaultCircleOptions,
        fillColor: '#21BA45',
        fillOpacity: serviceFee.hovered ? 0.2 : 0,
      }"
      :radius="serviceFee.range"
      :center="center"
    />
    <GMapCircle
      v-if="editingRange"
      :options="{
        ...defaultCircleOptions,
        fillColor: '#31CCEC',
        fillOpacity: 0.3,
      }"
      :radius="editingRange"
      :center="center"
    />
  </GMapMap>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IRestaurant, IServiceFee } from '@models/IRestaurant';

interface ServiceFeeState {
  hovered: boolean;
}

@Options({})
export default class MapViewer extends Vue {
  @Prop({ required: true }) restaurant!: IRestaurant;
  @Prop({ required: true }) serviceFees!: (IServiceFee & ServiceFeeState)[];
  @Prop() editingRange!: number | null;

  get defaultCircleOptions() {
    return {
      strokeColor: '#FF5722',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: '#FF5722',
      fillOpacity: 0.2,
    };
  }

  get mapOptions() {
    return {
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
    };
  }

  get center() {
    const { latitude, longitude } = this.restaurant.address;

    return { lat: latitude, lng: longitude};
  }
}
</script>
