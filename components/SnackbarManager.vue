<template>
  <div class="text-center">
    <v-snackbar v-model="open" :timeout="-1">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="closeSnackbar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "SnackbarManager",
  computed: mapState("snackbar", ["open", "text"]),
  methods: {
    ... mapMutations("snackbar", ["closeSnackbar"])
  }
}
</script>