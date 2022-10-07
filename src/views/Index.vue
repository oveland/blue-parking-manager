<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="reservation" href="/reservation">
          <icon name="reservation" color="tertiary"></icon>
        </ion-tab-button>

        <ion-tab-button tab="account" href="/account">
          <icon name="user" color="tertiary"></icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonPage, IonRouterOutlet } from '@ionic/vue';
import Icon from '@/components/Icon.vue';

export default defineComponent({
  name: 'TabsPage',
  components: { IonTabs, IonTabBar, IonTabButton, IonPage, IonRouterOutlet, Icon },
  setup() {
    return {

    }
  }
});
</script>
