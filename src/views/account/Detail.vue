<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          OPERADOR
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Operador</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-item>
          <ion-label position="floating">Código:</ion-label>
          <ion-input v-model="userCode" @ionChange="checkNumber($event)"></ion-input>
        </ion-item>
      </ion-content>
    </ion-content>

    <ion-fab vertical="top" horizontal="center" slot="fixed">
      <span class="user-code" v-if="validNumber">{{ userCode }}</span>
    </ion-fab>

    <ion-button color="tertiary" expand="full" :disabled="!validNumber" @click="save">
      Guardar
    </ion-button>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonItem,
  toastController,
  IonFab
} from '@ionic/vue';

import {Preferences as Storage} from '@capacitor/preferences';

export default defineComponent({
  name: 'Tab3Page',
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonLabel, IonInput, IonButton, IonItem, IonFab},
  data() {
    return {
      userCode: '',
      validNumber: true
    }
  },
  methods: {
    async load() {
      const {value} = await Storage.get({key: 'userCode'});
      this.userCode = value ? value : '';

      this.checkNumber();
    },
    checkNumber() {
      this.validNumber = this.isNumeric(this.userCode);
    },
    isNumeric(n: any) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    async save() {
      await Storage.set({
        key: 'userCode',
        value: this.userCode,
      });

      const toast = await toastController.create({
        message: `Código ${this.userCode} guardado correctamente`,
        duration: 1000,
        position: 'top',
        color: 'tertiary'
      });
      await toast.present();
    },
  },
  ionViewDidEnter() {
    this.load();
  },
});
</script>

<style scoped>
.user-code {
  font-size: 5rem;
  color: darkgray;
  width: 100%;
  text-align: center;
  position: absolute;
  top: 150px;
}
</style>
