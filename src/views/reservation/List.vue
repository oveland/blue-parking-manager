<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-segment>
            <ion-segment-button class="ion-float-end" @click="openSelectZone">
              <div class="select-zone__tab">
                <icon name="point" size="2" color="warning"></icon>
                <ion-label color="warning">{{ zone?.code }}</ion-label>
              </div>
            </ion-segment-button>
          </ion-segment>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-label>PARQUEOS</ion-label>
          <ion-segment class="select-zone">
            <ion-segment-button class="ion-float-end" @click="openSelectZone">
              <div class="select-zone__tab">
                <icon name="point" size="2" color="warning"></icon>
                <ion-label color="warning">{{ zone?.code }}</ion-label>
              </div>
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-progress-bar v-if="control.loading" type="indeterminate"></ion-progress-bar>
        <ion-refresher slot="fixed" @ionRefresh="reloadPage($event)">
          <ion-refresher-content
              :pulling-icon="chevronDownCircleOutline"
              pulling-text="Actualizar"
              refreshing-spinner="circles"
              refreshing-text="Cargando...">
          </ion-refresher-content>
        </ion-refresher>

        <select-parking-lot :selected="parking" :refresh="loadParkingLots"
                            @select="selectParking($event)"></select-parking-lot>

        <ion-content v-if="parking?.id && zone?.id">
          <ion-button v-if="!currentCheck?.isActive" @click="startCheck" color="tertiary" expand="full" class="sticky"
                      :disabled="control.loading">INICIAR CENSO
          </ion-button>
          <ion-button v-if="currentCheck?.isActive" @click="control.confirmFinishCheck = true" color="warning"
                      expand="full" class="sticky" :disabled="control.loading">FINALIZAR CENSO
          </ion-button>

          <ion-list>
            <ion-list-header>
              <span class="count-items">{{ activeReservations.length }}&nbsp;</span>Activos
            </ion-list-header>
            <loading-list :show="control.loading" :rows="activeReservations?.length"></loading-list>
            <detail-component v-if="!control.loading" :reservations="activeReservations" :rotation-check="currentCheck"
                              @create="createReservation($event)" @delete="deleteReservation($event)"></detail-component>

            <ion-list-header class="ion-padding-top ion-margin-top">
              <span class="count-items">{{ finishedReservations.length }}&nbsp;</span>Finalizados
            </ion-list-header>

            <loading-list :show="control.loading" :rows="finishedReservations?.length"></loading-list>
            <detail-component v-if="!control.loading" :reservations="finishedReservations"
                              :rotation-check="currentCheck"></detail-component>
          </ion-list>
        </ion-content>

        <confirm-close :open="control.confirmFinishCheck" :reservations="activeReservations"
                       :rotation-check="currentCheck" @confirm="finishCheck($event)"
                       @close="control.confirmFinishCheck = false"></confirm-close>

        <ion-modal
            :is-open="control.openModalZone"
            :breakpoints="[0.1, 0.6, 1]"
            :initialBreakpoint="0.6"
            @ionModalDidDismiss="closeSelectZone"
        >
          <select-zone :parking="parking" :selected="zone" @close-modal="closeSelectZone"
                       @select="selectZone($event)"></select-zone>
        </ion-modal>

        <ion-toast
            :is-open="control.error"
            :message="control.errorMessage"
            :duration="2000"
            @didDismiss="control.error = false"
            :translucent="true"
        ></ion-toast>
      </ion-content>
    </ion-content>

    <form-reservation-component :zone="zone" :rotation-check="currentCheck" v-if="currentCheck?.isActive && zone?.id"
                                @create="createReservation($event)" @add="add($event)"></form-reservation-component>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonProgressBar,
  IonLabel, IonList, IonListHeader,
  IonRefresher, IonRefresherContent,
  IonModal, IonToast,
  IonSegment, IonSegmentButton
} from '@ionic/vue';

import DetailComponent from '@/views/reservation/components/Detail.vue';
import ConfirmClose from '@/views/rotation/ConfirmClose.vue';
import SelectZone from '@/views/reservation/components/SelectZone.vue';
import SelectParkingLot from '@/views/reservation/components/SelectParkingLot.vue';
import LoadingList from '@/views/components/LoadingList.vue';

import {useReservation} from '@/composables/useReservation';
import {useRotation} from '@/composables/useRotation';
import {useVehicle} from '@/composables/useVehicle';

import {chevronDownCircleOutline} from 'ionicons/icons';
import Icon from '@/components/Icon.vue';
import FormReservationComponent from "@/views/reservation/components/Form.vue";

export default defineComponent({
  name: 'Tab1Page',
  components: {
    FormReservationComponent,
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton,
    SelectZone, SelectParkingLot, ConfirmClose, DetailComponent, LoadingList, IonProgressBar,
    IonLabel, IonList, IonListHeader,
    IonRefresher, IonRefresherContent,
    IonModal, IonToast,
    IonSegment, IonSegmentButton,
    Icon
  },
  data() {
    return {
      currentCheck: {
        id: null,
        isActive: false
      },
      activeReservations: [],
      finishedReservations: [],
      loadParkingLots: false,
      parking: {id: null, name: ''},
      zone: {id: null, code: ''},

      control: {
        openModalZone: false,
        confirmFinishCheck: false,
        loading: false,
        timeout: 20000,
        error: false,
        errorMessage: '',
      },
    }
  },
  ionViewDidEnter() {
    this.zone = {id: null, code: ''};
    this.loadParkingLots = true;
    setTimeout(() => {
      this.loadParkingLots = false;
    })
  },
  setup() {
    return {
      reservationS: useReservation(),
      vehicleS: useVehicle(),
      rotationS: useRotation(),
      chevronDownCircleOutline
    }
  },
  methods: {
    selectParking(parking: any) {
      this.parking = parking;
      this.openSelectZone();
    },
    openSelectZone() {
      this.control.openModalZone = (!this.currentCheck?.isActive || !this.zone?.id || true);
    },
    closeSelectZone() {
      this.control.openModalZone = false;
    },
    async selectZone(selected: any) {
      this.zone = selected;
      this.reload().then();
      this.closeSelectZone();
    },
    async reloadPage(event: any) {
      this.reload().then();
      event.target.complete();
    },
    async reload(hideLoading?:boolean) {
      this.loadCurrentCheck();
      this.loadList(hideLoading);
    },

    async createReservation(data: any) {
      if (data.plate) {
        data.zone = this.zone;
        const r = await this.reservationS.create(data);

        if(!r.success) {
          this.control.error = true;
          this.control.errorMessage = `Error al crear registro de parqueo. ${r.message}`;
        }
      } else {
        this.control.error = true;
        this.control.errorMessage = `Placa no reconocida. Hora ${data.time}`;
      }

      this.reload(true).then();
    },

    async deleteReservation(data: any) {
      this.activeReservations = this.activeReservations.filter((r: any) => r.id != data.id);
      await this.reservationS.remove(data);

      this.reload(true).then();
    },

    loadCurrentCheck() {
      if (!this.zone?.id) return null;

      this.rotationS.current({
        status: 'any',
        zone: this.zone
      }).then(currentCheck => {
        setTimeout(() => {
          this.currentCheck = currentCheck;
        }, 1000)
      });
    },
    async startCheck() {
      const startCheckConfirm = confirm(`Se iniciará el proceso de censo sobre ${this.zone?.code}`);
      if (startCheckConfirm) await this.rotationS.start({zone: this.zone});
      this.reload().then();
    },
    async finishCheck() {
      this.control.loading = true;
      await this.rotationS.finish({
        id: this.currentCheck?.id
      });

      this.control.confirmFinishCheck = false;

      await this.reload();
      this.control.loading = false;
    },

    loadList(hideLoading?:boolean) {
      if (!hideLoading) this.control.loading = true;

      if (!this.zone?.id) {
        this.activeReservations = [];
        this.finishedReservations = [];
        return null;
      }

      this.reservationS.list({
        status: 'active',
        zone: this.zone
      }).then(reservations => {
        this.control.loading = false;
        this.activeReservations = reservations;
      });

      this.reservationS.list({
        status: 'finished',
        zone: this.zone
      }).then(reservations => {
        this.finishedReservations = reservations;
        this.control.loading = false;
      });
    },

    add(reservation: never) {
      this.activeReservations.push(reservation);
    }
  },
  mounted() {
    this.reload();
  }
});
</script>

<style scoped>
.count-items {
  margin-right: 0.1rem;
}

.select-zone {
  position: absolute;
  right: 8px;
  top: 0;
}

ion-toolbar {
  overflow: visible;
}

ion-segment-button {
  border: none;
  background: white;
  box-shadow: none;
}

.sticky {
  position: sticky;
  top: 5px;
  z-index: 1;
}

.select-zone__tab {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
