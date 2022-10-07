<template>
  <!-- Skeleton screen -->
  <div v-if="show">
    <ion-list class="ion-no-margin ion-no-padding">
      <ion-item v-for="row in size" :key="row">
        <ion-avatar slot="start">
          <icon class="icon-vehicle" name="vehicle" size="3" style="opacity: 20%"></icon>
        </ion-avatar>
        <ion-label>
          <h3>
            <ion-skeleton-text animated style="width: 20%;height: 12px"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </p>
          <ion-thumbnail slot="end" class="mark">
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-thumbnail>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<script>
import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonThumbnail
} from '@ionic/vue';

import Icon from '@/components/Icon';

export default {
  name: "LoadingList",
  props: ['show', 'rows'],
  components: {
    IonAvatar,
    IonItem,
    IonLabel,
    IonList,
    IonSkeletonText,
    IonThumbnail,

    Icon
  },
  computed: {
    size() {
      return this.rows ? this.rows : 1;
    }
  }
}
</script>

<style scoped>
.icon-vehicle {
  animation: pulse 1s infinite;
}

.mark {
  position: absolute;
  right: 1rem;
  top: 40%;
  height: 15px;
  width: 15px;
}

.mark ion-skeleton-text{
  border-radius: 100px;
}

/* Custom Skeleton Line Height and Margin */
.custom-skeleton ion-skeleton-text {
  line-height: 13px;
}

.custom-skeleton ion-skeleton-text:last-child {
  margin-bottom: 5px;
}

@keyframes pulse {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 15%;
  }

  100% {
    opacity: 0%;
  }
}
</style>
