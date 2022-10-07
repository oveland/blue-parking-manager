<template>
  <ion-toolbar>
    <ion-segment v-if="parkingLots?.length" :value="current.id.toString()">
      <ion-segment-button :value="parking.id" v-for="parking in parkingLots" :key="parking.id" @click="select(parking)">
        <div class="select-parking__tab">
          <icon name="parking" size="2" color="primary"></icon> {{ parking.name }}
        </div>
      </ion-segment-button>
    </ion-segment>

    <ion-item v-else class="ion-padding" @click="load">
      <ion-avatar slot="start" class="ion-align-items-center ion-text-center">
        <icon name="parking" size="4" color="danger"></icon>
      </ion-avatar>
      <ion-label>
        <h2>SIN ZONAS</h2>
        <p>No tiene zonas asignadas</p>
      </ion-label>
    </ion-item>
  </ion-toolbar>
</template>

<script>
import {defineComponent} from 'vue';
import {IonLabel, IonAvatar, IonItem, IonToolbar, IonSegment, IonSegmentButton} from '@ionic/vue';

import Icon from '@/components/Icon.vue';
import {useParking} from '@/composables/useParking';
import {Preferences as Storage} from '@capacitor/preferences';

export default defineComponent({
  name: "SelectParkingComponent",
  props: ['selected', 'refresh'],
  emits: ['select'],
  components: {Icon, IonLabel, IonAvatar, IonItem, IonToolbar, IonSegment, IonSegmentButton},
  data() {
    return {
      userCode: null,
      current: {
        id: Number,
        name: String,
        address: String,
        description: String,
        inStreet: Boolean,
      },
      parkingLots: []
    }
  },
  watch: {
    refresh() {
      if (this.refresh === true) {
        this.load();
      }
    }
  },
  setup() {
    return {
      parkingS: useParking()
    }
  },
  methods: {
    async checkUserCode() {
      const {value} = await Storage.get({key: 'userCode'});

      this.userCode = value;
    },
    async load() {
      await this.checkUserCode();
      if (!this.userCode) return this.select(null);
      this.parkingLots = await this.parkingS.lots({code: this.userCode});

      if (!this.current?.id && this.parkingLots.length) {
        this.select(this.parkingLots[0]);
      }
    },
    select(parking) {
      this.current = parking;
      this.$emit('select', parking);
    },
  },
  mounted() {
    this.checkUserCode();
    this.current = this.selected;
  },
})
</script>

<style scoped>

.select-parking__tab {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
