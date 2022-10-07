<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title @click="closeModal" color="secondary" class="ion-text-center">
        OK
      </ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-list>
      <ion-item v-if="parking?.id" class="ion-no-padding ion-padding-horizontal">
        <ion-avatar slot="start" class="ion-align-items-center ion-text-center">
          <icon name="parking" size="4" color="primary"></icon>
        </ion-avatar>
        <ion-label>
          <h2>{{ parking?.name }}</h2>
          <p>{{ parking.address }}</p>
          <p>{{ parking.description }}</p>
        </ion-label>
      </ion-item>
    </ion-list>

    <ion-list v-if="zones?.length">
      <ion-item v-for="zone in zones" :key="zone.id" @click="select(zone)"
                :color="zone.id === current.id ? 'secondary' : ''">
        <ion-avatar slot="start" class="ion-align-items-center ion-text-center">
          <icon name="point" size="3" color="warning"></icon>
        </ion-avatar>
        <ion-label>
          <h2>{{ zone.code }}</h2>
          <p>{{ zone.description }}</p>
          <p v-if="zone.totalReservations">{{ zone.totalReservations }} parqueados</p>
        </ion-label>
      </ion-item>
    </ion-list>
    <ion-list v-else>
      <ion-item class="ion-padding" v-if="parking?.id">
        <ion-avatar slot="start" class="ion-align-items-center ion-text-center">
          <icon name="point" size="4" color="danger"></icon>
        </ion-avatar>
        <ion-label>
          <h2>En {{ parking.name }}</h2>
          <p>No existen cuadras de parqueo</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>


<script>
import {defineComponent} from 'vue';
import {IonLabel, IonAvatar, IonList, IonItem, IonTitle, IonContent, IonHeader, IonToolbar} from '@ionic/vue';

import Icon from '@/components/Icon.vue';
import {useParking} from '@/composables/useParking';

export default defineComponent({
  name: "SelectParkingComponent",
  props: ['parking', 'selected'],
  emits: ['close-modal', 'select'],
  components: {Icon, IonLabel, IonAvatar, IonList, IonItem, IonTitle, IonContent, IonHeader, IonToolbar},
  data() {
    return {
      current: {
        id: Number,
        name: String,
        address: String,
        description: String,
        inStreet: Boolean,
      },
      zones: []
    }
  },
  setup() {
    return {
      parkingS: useParking()
    }
  },
  methods: {
    async load() {
      if(!this.parking?.id) return this.select(null);
      this.zones = await this.parkingS.zones({ parking: this.parking.id});
    },
    select(zone) {
      this.current = zone;
      this.$emit('select', zone);
    },
    closeModal() {
      this.$emit('close-modal');
    }
  },
  mounted() {
    this.current = this.selected;
    this.load();
  }
})
</script>

<style scoped>
</style>
