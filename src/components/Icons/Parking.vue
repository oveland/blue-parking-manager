<template>
    <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="parking-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
      <path fill="currentColor" d="M280,208H232v32h48a16,16,0,0,0,0-32ZM248,8C111,8,0,119,0,256S111,504,248,504,496,393,496,256,385,8,248,8Zm32,296H232v48a16,16,0,0,1-16,16H184a16,16,0,0,1-16-16V160a16,16,0,0,1,16-16h96a80,80,0,0,1,0,160Z"></path>
    </svg>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ParkingIcon',
  props: {light: null}
})
</script>

<style scoped>

</style>
