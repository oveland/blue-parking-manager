<template>
  <ion-modal
      :is-open="open && rotationCheck?.id"
      @ionModalDidDismiss="close"
  >
    <ion-header translucent>
      <ion-toolbar>
        <ion-title color="warning" class="ion-text-center">
          <ion-label @click="close" class="ion-float-end">
            <icon name="times" color="white" size="3"></icon>
          </ion-label>
          <div style="margin-top: 8px">Finalizar Censo</div>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="ion-padding ion-text-center">
        <div v-if="toFinish.length">
          <h4>{{ toFinish.length }} parqueos a finalizar:</h4>
          <ion-list class="ion-padding">
            <ion-item v-for="r in toFinish" :key="r.id">{{ r.vehicle.plate }} • {{ r.startTime }}</ion-item>
          </ion-list>
        </div>
        <h4 v-else style="margin-top: 60%; color: grey">No se finalizará ningún registro de parqueo</h4>
      </div>
    </ion-content>
    <ion-button style="position: absolute; bottom:0; width: 100%" color="warning" size="large" expand="full" @click="confirmClose">
      Confirmar
    </ion-button>
  </ion-modal>

  <ion-loading
      :is-open="control.loading"
      message="Cargando..."
      :duration="control.timeout"
      @didDismiss="control.loading = false"
  >
  </ion-loading>
</template>

<script>
import {defineComponent} from 'vue';
import {IonLoading, IonModal, IonHeader, IonTitle, IonToolbar, IonContent, IonButton, IonLabel, IonList, IonItem} from '@ionic/vue';
import Icon from '@/components/Icon.vue';

export default defineComponent({
  name: "ConfirmClose",
  emits: ['confirm', 'close'],
  props: ['open', 'reservations', 'rotationCheck'],
  components: {
    IonLoading, IonModal, IonHeader, IonTitle, IonToolbar, IonContent, IonButton, IonLabel, IonItem, IonList,
    Icon
  },
  data() {
    return {
      control: {
        loading: false,
        timeout: 20000,
        error: false,
        errorMessage: '',
      },
    }
  },
  computed: {
    toFinish() {
      let finishReservations = [];
      if (this.reservations && this.reservations?.length) {
        for(let r of this.reservations) {
          if (r.check?.id !== this.rotationCheck?.id) {
            finishReservations.push(r);
          }
        }
      }

      return finishReservations;
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirmClose() {
      this.$emit('confirm');
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
  border: 6px solid var(--ion-color-success-tint) !important;
  height: 5rem;
  width: 5rem;
  margin: -10% 0 0 -1rem !important;
}
</style>
