<template>
  <ion-list>
    <ion-item-sliding v-for="reservation in reservations" :key="reservation.id" :class="{finished: reservation.end}">
      <ion-item-options side="start" @click="setContinue(reservation)">
        <ion-item-option color="primary">
          <icon name="parking" size="4" color="blue"></icon>
        </ion-item-option>
      </ion-item-options>

      <ion-item>
        <ion-avatar slot="start">
          <icon :key="reservation.vehicle.type.id" :name="reservation.vehicle.type.icon"
                :color="reservation.vehicle.type.color" size="3"></icon>
          <ion-progress-bar v-if="reservation.local && reservation.isProcessing"
                            type="indeterminate"></ion-progress-bar>
        </ion-avatar>
        <ion-label>
          <h2 class="strong">{{ reservation.vehicle.plate }}</h2>
          <h3>{{ reservation.status.time }}</h3>

          <p class="strong">{{ reservation.startTime }} -
            {{ reservation.end ? reservation.endTime : reservation.status?.name }}</p>

          <span v-if="!reservation.end && !reservation.local && !reservation.vehicle.editablePlate" class="mark"
                :class="`${reservation.check?.id === rotationCheck?.id ? 'mark-current' : 'mark-prev'}`"
                color="primary">•</span>
        </ion-label>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="tertiary" @click="setEdit(reservation)">
          <icon name="edit" size="3" color="blank"></icon>
        </ion-item-option>
        <ion-item-option color="danger" @click="setDelete(reservation)">
          <icon name="times" size="4" color="blank"></icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>

  <div v-if="continueReservation?.id">
    <ion-alert
        :is-open="continueReservation?.id"
        header="Hey!"
        sub-header="Nos encontramos desarrollando esta funcionalidad"
        message="Permitirá indicar que el vehículo aún sigue parqueado"
        :buttons="[{
              text: 'Ok',
              role: 'confirm',
              handler: close,
            }]"
        @didDismiss="close"
    ></ion-alert>
  </div>

  <div v-if="editReservation?.id">
    <ion-alert
        :is-open="editReservation?.id"
        header="Hey!"
        sub-header="Nos encontramos desarrollando esta funcionalidad"
        message="Permitirá modificar el valor de la placa y el tipo de vehículo"
        :buttons="[{
              text: 'Ok',
              role: 'confirm',
              handler: close,
            }]"
        @didDismiss="close"
    ></ion-alert>
  </div>

  <div v-if="deleteReservation?.id">
    <ion-alert
        :is-open="deleteReservation?.id"
        header="Eliminará el siguiente registro"
        :sub-header="`Vehículo ${deleteReservation.vehicle.plate}`"
        :message="deleteReservation.vehicle.type.name"
        :buttons="['Cancelar', {
              text: 'Eliminar',
              role: 'confirm',
              handler: confirmDelete,
            }]"
        @didDismiss="close"
    ></ion-alert>
  </div>
</template>

<script>
import {
  IonItem, IonAvatar, IonLabel, IonProgressBar, IonList,
  IonItemOptions, IonItemOption, IonItemSliding, IonAlert
} from "@ionic/vue";
import Icon from "@/components/Icon";

export default {
  name: "ReservationDetail",
  emits: ['create', 'edit', 'delete'],
  props: ['reservations', 'rotationCheck'],
  data() {
    return {
      editReservation: {},
      deleteReservation: {},
      continueReservation: {},
    }
  },
  components: {
    IonItem, IonAvatar, IonLabel, IonProgressBar,
    Icon, IonList,
    IonItemOptions, IonItemOption, IonItemSliding, IonAlert
  },
  methods: {
    setContinue(reservation) {
      this.continueReservation = reservation;
    },
    confirmContinue() {
      // console.log('Confirm continue');
    },
    setEdit(reservation) {
      this.editReservation = reservation;
    },
    confirmEdit() {
      // console.log('Confirm Edit');
    },
    setDelete(reservation) {
      this.deleteReservation = reservation;
    },
    confirmDelete() {
      this.$emit('delete', this.deleteReservation);
    },
    close() {
      this.deleteReservation = {};
      this.editReservation = {};
    },
    create(reservation) {
      this.close();

      setTimeout(() => {
        this.$emit('create', reservation);
      }, 700); // Note: Wait while modal is closed

    }
  }
}
</script>

<style scoped>

.finished {
  opacity: 60%;
}

.mark {
  font-size: 4rem;
  position: absolute;
  right: 1rem;
  top: 0;
}

.reservation-edit {
  position: absolute;
  right: 1rem;
  top: 30%;
  opacity: 50%;
}

.mark-prev {
  color: var(--ion-color-danger);
}

.mark-current {
  color: var(--ion-color-warning);
}

.strong {
  font-weight: bold !important;
  color: var(--ion-color-dark-tint) !important;
}

p {
  color: var(--ion-color-dark-shade);
}
</style>
