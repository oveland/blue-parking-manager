<template>
    <span :class="fillColor" @click="$emit('click', $event)" :color="fillColor">
        <component :is="iconComponent" :class="`s-${size}`" :light="fillColorLight"></component>
        <slot></slot>
    </span>
</template>

<script lang="ts">

import {defineComponent, defineAsyncComponent} from 'vue';

export default defineComponent({
  name: 'IconComponent',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'dark'
    },
    density: {
      type: [Number],
      default: 600
    },
    h: {
      type: [Number, String],
      default: 6
    },
    w: {
      type: [Number, String],
      default: 6
    },
    size: {
      type: [Number, String],
      default: ""
    }
  },
  components: {},
  computed: {
    width() {
      return this.size ? this.size : this.w;
    },
    height() {
      return this.size ? this.size : this.h;
    },
    iconComponent() {
      return defineAsyncComponent(() => import(`./Icons/${this.componentNameIcon()}`));
    },
    fillColor() {
      switch (this.color) {
        case 'amber':
          return 'warning';
        case 'rose':
          return 'tertiary';
        case 'green':
          return 'success';
        case 'red':
          return 'danger';
        case 'indigo':
          return 'primary';
        default:
          return this.color;
      }
    },
    fillColorLight() {
      let densityLight = this.density - 200;

      if (this.color === 'black' || this.color === 'blank') {
        return `text-gray-400`;
      }

      if (this.density > 200) {
        return `text-${this.color}-${densityLight}`;
      }

      return `text-${this.color}-50`;
    },
  },
  methods: {
    componentNameIcon() {
      let iconName = "";

      this.name.toLowerCase().split('-').map(section => {
        iconName += section.charAt(0).toUpperCase() + section.slice(1);
      });

      return iconName;
    }
  }
})
</script>

<style scoped>
span svg {
  height: 20px;
}

span svg.s-1 {
  height: 10px;
}

span svg.s-2 {
  height: 20px;
}

span svg.s-3 {
  height: 30px;
}

span svg.s-4 {
  height: 40px;
}

span[color="primary"] {
  color: var(--ion-color-primary);
}

span[color="secondary"] {
  color: var(--ion-color-secondary);
}

span[color="tertiary"] {
  color: var(--ion-color-tertiary);
}

span[color="success"] {
  color: var(--ion-color-success);
}

span[color="warning"] {
  color: var(--ion-color-warning);
}

span[color="danger"] {
  color: var(--ion-color-danger);
}

span[color="dark"] {
  color: var(--ion-color-dark);
}

span[color="medium"] {
  color: var(--ion-color-medium);
}

span[color="light"] {
  color: var(--ion-color-light);
}
</style>
