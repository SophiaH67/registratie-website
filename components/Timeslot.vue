<template>
  <div>
    <v-card
      elevation="2"
      width="80%"
      min-width="30rem"
      max-width="60rem"
      style="margin: 1rem"
    >
      <v-card-title>
        {{ startTime }} - {{ endTime }}
      </v-card-title>
      <v-card-actions>
        <v-list-item class="grow">
          <v-btn
            :color="registered ? 'error' : 'primary'"
            :outlined="registered"
            elevation="2"
            @click="onClick()"
            :disabled="roomLeft <= 0 && !registered"
          >
            {{ registered ? "Uitschrijven" : "Inschrijven"}}
          </v-btn>
          <v-row
            align="center"
            justify="end"
          >
            <v-avatar
              v-for="family in families"
              :key="family.name"
            >
              <img
                :src="`/api/getPicture?id=${family.picture}`"
                :alt="family.name"
                :title="family.name"
              >
            </v-avatar>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: "Timeslot",
  modules: [
    '@nuxtjs/dayjs'
  ],
  props: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    families: {
      type: Array,
      required: true
    },
    slotID: {
      type: String,
      required: true
    },
    roomLeft: {
      type: Number,
      required: true
    },
    registered: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    async onClick () {
      this.registered ? this.unRegister(this.slotID) : this.openDialog()
    },
    async openDialog() {
      let dialogObject = {
        slotID: this.slotID,
        title: `Registreren voor ${this.startTime}`,
        roomLeft: this.roomLeft
      }
      this.openSignupDialog(dialogObject)
    },
    async unRegister(slotID) {
      if (!this.registered) return this.createSnackbar("Je bent niet geregistreerd, herlaad de pagina")
      this.$axios.$post("/api/removeFamily", {token: localStorage.getItem(slotID), slotID: slotID}).then(res => {
        localStorage.removeItem(slotID)
        this.getTimeslots()
      })
      .catch(e => {
        if (!e.response.data.error) throw e
        this.createSnackbar(e.response.data.error)
      })
    },
    ...mapMutations("dialog", ['openSignupDialog']),
    ...mapMutations("snackbar", ['createSnackbar']),
    ...mapMutations("timeslots", ['updateRegistered']),
    ...mapActions("timeslots", ['getTimeslots'])
  },
  created () {this.updateRegistered()}
}
</script>