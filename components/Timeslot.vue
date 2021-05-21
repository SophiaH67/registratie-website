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
            color="primary"
            elevation="2"
            @click="openDialog()"
          >
            Inschrijven
          </v-btn>
          <v-row
            align="center"
            justify="end"
          >
            <v-avatar
              v-for="person in people"
              :key="person.name"
            >
              <img
                :src="person.picture"
                :alt="person.name"
                :title="person.name"
              >
            </v-avatar>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
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
    people: {
      type: Array,
      required: true
    },
    slotID: {
      type: String,
      required: true
    }
  },
  methods: {
    async openDialog() {
      let dialogObject = {
        slotID: this.slotID,
        title: `Registreren voor ${this.startTime}`
      }
      this.openSignupDialog(dialogObject)
    },
    ...mapMutations(['openSignupDialog'])
  }
}
</script>