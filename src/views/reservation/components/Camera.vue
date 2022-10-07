<template>
  <ion-fab v-if="zone" vertical="bottom" horizontal="center" slot="fixed">
    <ion-fab-button @click="getPhoto()" color="light">
      <icon name="camera" color="success" size="3"></icon>
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
  </ion-fab>
</template>

<script>
import {defineComponent} from 'vue';
import {IonFab, IonFabButton, IonLoading, IonToast} from '@ionic/vue';
import Icon from '@/components/Icon.vue';
import {useCamera} from '@/composables/useCamera';
import {useGeolocation} from '@/composables/useGeolocation';
import {useVehicle} from '@/composables/useVehicle';
import {useDatabase} from '@/composables/useDatabase';
import moment from "moment";

export default defineComponent({
  name: "CameraComponent",
  props: ['zone', 'rotationCheck'],
  emits: ['add', 'create'],
  components: {Icon, IonFab, IonFabButton, IonLoading, IonToast},
  data() {
    return {
      control: {
        loading: false,
        timeout: 20000,
        error: false,
        errorMessage: '',
      },

      readyPhoto: false,
      readyLocation: false,
      vehicle: {
        uid: String,
        time: String,
        datetime: String,
        plate: String,
        location: {
          timestamp: Number,
          latitude: Number,
          longitude: Number,
          accuracy: Number,
        },
        type: Object
      }
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
      this.vehicle.type = {
        id: 1,
        icon: 'vehicle',
        color: 'secondary',
      }

      this.readyPhoto = false;
      this.readyLocation = false;

      this.control.loading = false;
    },
    getPhoto() {
      this.reset();
      this.control.loading = true;

      this.cameraS.takePhoto().then(async photo => {
        if (photo) {
          this.control.loading = true;
          const now = moment();

          this.vehicle.datetime = now.format('YYYY-MM-DD HH:mm:ss');
          this.vehicle.time = now.format('HH:mm:ss');

          let reservation = this.db.createReservation({
            datetime: this.vehicle.datetime,
            time: this.vehicle.time,
            plate: 'Procesando...',
            zone: this.zone?.id,
            rotationCheck: this.rotationCheck,
            vehicleType: this.vehicle.type,
            parkingType: 1,
            parkingZone: 1,
            latitude: this.readyLocation ? this.vehicle.location.latitude : 0,
            longitude: this.readyLocation ? this.vehicle.location.longitude : 0,
            photo: photo.dataUrl
          });

          this.vehicle.uid = reservation.uid;
          this.control.loading = false;

          setTimeout(() => {
            this.add(reservation);
          }, 1000);

          this.vehicleS.decodePlate(reservation.uid, photo, reservation.start).then(plate => {
            this.vehicle.plate = plate;
            this.db.setReservationPlate(reservation.uid, plate).then();

            this.readyPhoto = true;
            this.process();
          });
        } else {
          this.control.loading = false;
        }
      }).catch(() => {
        this.control.loading = false;
      });

      this.geolocationS.getLocation().then(async location => {
        const coords = location.coords;
        this.vehicle.location = coords;

        if (this.readyPhoto) this.db.setReservationLocation(this.vehicle.uid, coords?.latitude, coords?.longitude).then();

        this.readyLocation = true;
        this.process();
      }).catch(() => {
        this.readyLocation = true;
        this.process();
      }).finally(() => {
        this.readyLocation = true;
        this.process();
      });
    },
    process() {
      if (this.readyPhoto && this.readyLocation) {
        this.$emit('create', this.vehicle);
      }
    },
    add(reservation) {
      this.$emit('add', reservation);
    }
  },
  mounted() {
    // this.takePhoto();
  }
})
</script>

<style scoped>
ion-fab {
  z-index: 10000;
}

ion-fab-button {
  border-radius: 100px;
  border: 6px solid var(--ion-color-success-tint) !important;
  height: 5rem;
  width: 5rem;
  margin: -10% 0 0 -1rem !important;
}
</style>
