<template>
  <ion-fab v-if="zone" vertical="bottom" horizontal="center" slot="fixed">
    <ion-fab-button @click="openForm()" color="light">
      <icon name="parking" color="primary" size="3"></icon>
    </ion-fab-button>

    <ion-loading
        :is-open="control.loading"
        cssClass="camera-loading"
        message="Cargando..."
        :duration="control.timeout"
        @didDismiss="control.loading = false"
    >
    </ion-loading>

    <ion-toast
        :is-open="control.error"
        :message="control.errorMessage"
        :duration="2000"
        @didDismiss="control.error = false"
    ></ion-toast>

    <ion-modal
        :is-open="control.openModalForm"
        :breakpoints="[0.1, 0.6, 1]"
        :initialBreakpoint="0.6"
        @ionModalDidDismiss="closeForm"
    >
      <ion-header translucent>
        <ion-toolbar>
          <ion-title @click="register" color="secondary" class="ion-text-center" v-if="validPlate">
            REGISTRAR
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content fullscreen>
        <ion-item class="vehicle-types__plate">
          <ion-label position="floating">
            <icon name="reservation" size="2" color="blue"></icon>
            PLACA
          </ion-label>
          <ion-input id="input-plate" v-model="vehicle.plate" :value="filteredPlate" :autofocus="true" color="primary"
                     :maxlength="10" :minlength="0"></ion-input>
        </ion-item>
        <ion-list v-if="vehicleTypes?.length" class="vehicle-types__list">
          <ion-item v-for="vt in vehicleTypes" :key="vt.id" @click="selectVehicleType(vt)"
                    :color="vt.id === vehicle.type.id ? 'secondary' : ''">
            <ion-avatar slot="start" class="ion-align-items-center ion-text-center">
              <icon :name="vt.icon" size="3" :color="vt.color"></icon>
            </ion-avatar>
            <ion-label>
              <h2>{{ vt.name }}</h2>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>
  </ion-fab>
</template>

<script>
import {defineComponent} from 'vue';
import {
  IonFab,
  IonFabButton,
  IonLoading,
  IonToast,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle,
  IonList,
  IonAvatar,
} from '@ionic/vue';
import Icon from '@/components/Icon.vue';
import {useCamera} from '@/composables/useCamera';
import {useGeolocation} from '@/composables/useGeolocation';
import {useVehicle} from '@/composables/useVehicle';
import {useDatabase} from '@/composables/useDatabase';
import moment from "moment";

export default defineComponent({
  name: "FormReservationComponent",
  props: ['zone', 'rotationCheck'],
  emits: ['add', 'create'],
  components: {
    Icon, IonFab, IonFabButton, IonLoading, IonToast, IonModal, IonItem, IonLabel, IonInput, IonToolbar,
    IonHeader,
    IonContent,
    IonTitle,
    IonList,
    IonAvatar,
  },
  data() {
    return {
      control: {
        loading: false,
        timeout: 20000,
        error: false,
        errorMessage: '',
        openModalForm: false
      },
      vehicleTypes: [],
      vehicle: {
        uid: String,
        time: String,
        datetime: String,
        plate: '',
        location: {
          timestamp: Number,
          latitude: Number,
          longitude: Number,
          accuracy: Number,
        },
        type: Object,
      },
    }
  },
  setup() {
    return {
      cameraS: useCamera(),
      geolocationS: useGeolocation(),
      vehicleS: useVehicle(),
      db: useDatabase()
    }
  },
  methods: {
    reset() {
      this.vehicle.uid = '';
      this.vehicle.plate = '';
      this.vehicle.datetime = '';

      this.control.loading = false;

      this.refreshParams().then();
    },
    async refreshParams() {
      this.vehicleTypes = await this.vehicleS.getTypes();
      if (this.vehicleTypes.length) this.vehicle.type = this.vehicleTypes[0];
    },
    openForm() {
      this.reset();
      this.control.openModalForm = true;
    },
    closeForm() {
      this.control.loading = false;
      this.control.openModalForm = false;
    },
    selectVehicleType(type) {
      this.vehicle.type = type;
    },
    async register() {
      this.control.loading = true;

      const now = moment();

      this.vehicle.datetime = now.format('YYYY-MM-DD HH:mm:ss');
      this.vehicle.time = now.format('HH:mm:ss');

      let reservation = this.db.createReservation({
        datetime: this.vehicle.datetime,
        time: this.vehicle.time,
        plate: this.vehicle.plate,
        zone: this.zone?.id,
        rotationCheck: this.rotationCheck,
        vehicleType: this.vehicle.type,
        parkingType: 1,
        parkingZone: 1,
        latitude: 0,
        longitude: 0,
        photo: ''
      });

      this.vehicle.uid = reservation.uid;

      try {
        this.geolocationS.getLocation().then(async location => {
          const coords = location.coords;
          this.vehicle.location = coords;

          this.db.setReservationLocation(this.vehicle.uid, coords?.latitude, coords?.longitude).then();
        }).catch((e) => {
          console.log('Error ', e)
        }).finally(() => {
          this.create();
        });
      } catch (ignored) {
        this.create();
      }
    },
    create() {
      this.$emit('create', this.vehicle);
      this.closeForm();
    }
  },
  computed: {
    filteredPlate() {
      const plate = this.vehicle.plate;
      return plate.toString().replaceAll(' ', '').trim().toUpperCase().substring(0, 10);
    },
    validPlate() {
      return this.filteredPlate && this.filteredPlate.length <= 10;
    },
  }
})
</script>

<style scoped>
ion-fab {
  z-index: 10000;
}

ion-fab-button {
  border-radius: 100px;
  border: 6px solid var(--ion-color-primary-tint) !important;
  height: 5rem;
  width: 5rem;
  margin: -10% 0 0 -1rem !important;
}

.vehicle-types__list ion-item ion-avatar {
  display: flex;
}

.vehicle-types__plate {
  margin-bottom: 12px;
}

.vehicle-types__plate ion-label {
  display: flex;
  gap: 8px;
}
</style>
