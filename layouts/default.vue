<template>
  <v-app dark>
    <SnackbarManager />
    <nuxt />
  </v-app>
</template>

<script>
import SnackbarManager from '~/components/SnackbarManager';
export default {
  components: {
    SnackbarManager
  }
}
</script>