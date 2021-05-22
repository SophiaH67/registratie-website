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
            :color="this.registered ? 'error' : 'primary'"
            :outlined="this.registered"
            elevation="2"
            @click="onClick()"
            :disabled="roomLeft <= 0 && !registered"
          >
            {{ this.registered ? "Uitschrijven" : "Inschrijven"}}
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
    }
  },
  data: () => {
    return {
      registered: false
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
    async checkRegistered() {
      if(!process.browser) return
      this.registered = !!localStorage.getItem(this.slotID)
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
    ...mapActions("timeslots", ['getTimeslots'])
  },
  created () {this.checkRegistered()}
}
</script>