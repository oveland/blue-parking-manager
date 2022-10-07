<template>
  <ion-page v-if="reservation">
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-label @click="$emit('close')" class="ion-float-end">
            <icon name="times" color="white" size="3"></icon>
          </ion-label>
          <div style="margin-top: 8px">Establecer placa</div>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Establecer placa</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <div class="ion-padding">
          <ion-label>Registro: {{ reservation.start }}</ion-label>
        </div>

        <div class="ion-text-center box-plate" @click="focus()">
          <div :class="{empty: !filteredPlate}">
            <ion-label class="ion-text-uppercase">{{ filteredPlateShow }}</ion-label>
          </div>
        </div>
        <div v-show="showPhoto">
          <img :src="photo" alt="Photo" style="width: 100%" @load="showPhoto = true"/>
        </div>
        <div v-show="!showPhoto" class="ion-text-center">
          <h3 style="margin-top: 60%">Cargando foto...</h3>
        </div>
      </ion-content>
    </ion-content>
    <ion-item style="position: fixed;bottom: 8%;width: 100%;z-index: 10000">
      <ion-label position="floating" style="font-weight: bold;font-size: 1.2rem">INGRESE PLACA:</ion-label>
      <ion-input id="input-plate" v-model="plate" :autofocus="true" :maxlength="10"></ion-input>
    </ion-item>
    <ion-button color="tertiary" expand="full" :disabled="!validaPlate" @click="save" size="large">
      <span style="font-size: 1rem">Guardar</span>
    </ion-button>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonInput, IonButton, IonItem} from '@ionic/vue';

import {useDatabase} from '@/composables/useDatabase';
import Icon from '@/components/Icon.vue';

export default defineComponent({
  emits: ['close', 'create'],
  components: {
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonLabel, IonInput, IonButton, IonItem,
    Icon
  },
  props:['reservation'],
  data() {
    return {
      plate: '',
      photo: '',
      showPhoto: false
    }
  },
  setup() {
    return {
      db: useDatabase()
    }
  },
  watch: {
    reservation() {
      this.plate = '';
      this.photo = '';

      this.loadPhoto();
    }
  },
  computed: {
    validaPlate() {
      return this.filteredPlate && this.filteredPlate.length === 6;
    },
    filteredPlate() {
      return this.plate.replaceAll(' ', '').trim().toUpperCase().substring(0, 6);
    },
    filteredPlateShow() {
      return this.filteredPlate ? this.filteredPlate : '••••••';
    },
    formData() {
      return {
        uid: this.reservation.uid,
        datetime: this.reservation.start,
        plate: this.filteredPlate,
        location: this.reservation.location,
        zone: this.reservation.zone,
      }
    }
  },
  methods: {
    async loadPhoto() {
      this.photo = await this.db.loadPhoto(this.reservation.uid);
    },
    async save() {
      await this.db.setReservationPlate(this.reservation.uid, this.filteredPlate);
      this.$emit('create', this.formData);
    },
    focus() {
      document.getElementById('input-plate')?.click();
    }
  },
  mounted() {
    this.loadPhoto();
    setTimeout(() => this.focus(), 1000);
  }
});
</script>

<style scoped>
.box-plate {
  padding: 0 !important;
  position: sticky;
  z-index: 1000;
  top: 0%;
  border-radius: 20px;
  width: 100%;
}

.box-plate div.empty{
  opacity: 50%;
}

.box-plate div{
  background: yellow;
  padding: 5px;
  font-size: 2rem;
  float: right;
  width: 100%;
}
.box-plate ion-label {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #313030;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  border: 5px solid #313030;
  border-radius: 10px;
}

</style>
