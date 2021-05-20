<template>
  <div>
    <v-card>
      <v-dialog
        ref="startTimeDialog"
        v-model="startTimePickerOpen"
        :return-value.sync="startTimeFormatted"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="startTimeFormatted"
            label="De start tijd"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="startTimePickerOpen"
          v-model="startTimeFormatted"
          full-width
          format="24hr"
        >
          <v-spacer />
          <v-btn text color="primary" @click="startTimePickerOpen = false">
            Annuleren
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.startTimeDialog.save(startTimeFormatted)"
          >
            Oké
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-card>

    <v-card>
      <v-dialog
        ref="endTimeDialog"
        v-model="endTimePickerOpen"
        :return-value.sync="endTimeFormatted"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="endTimeFormatted"
            label="De eind tijd"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="endTimePickerOpen"
          v-model="endTimeFormatted"
          full-width
          format="24hr"
        >
          <v-spacer />
          <v-btn text color="primary" @click="endTimePickerOpen = false">
            Annuleren
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.endTimeDialog.save(endTimeFormatted)"
          >
            Oké
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-card>

    <v-card>
      <v-dialog
        ref="dateDialog"
        v-model="datePickerOpen"
        :return-value.sync="dateFormatted"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateFormatted"
            label="De dag van het evenement"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-if="datePickerOpen"
          v-model="dateFormatted"
          full-width
          show-current
        >
          <v-spacer />
          <v-btn text color="primary" @click="datePickerOpen = false">
            Annuleren
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.dateDialog.save(dateFormatted)"
          >
            Oké
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-card>
    <v-card>
      <v-text-field
        v-model="timeslotLength"
        label="Lengte van elk timeslot (in minuten)"
        prepend-icon="mdi-clock-time-four-outline"
      ></v-text-field>
    </v-card>
    <v-card>
      <v-btn
        color="primary"
        block
        @click="submit(dateFormatted, startTimeFormatted, endTimeFormatted, timeslotLength)"
      >
        Submit
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  data: function () {
    return {
      minimumDate: dayjs().format("YYYY-MM-DD"),
      maximumDate: dayjs().add(2, "year").format("YYYY-MM-DD"),
      dateFormatted: dayjs().format("YYYY-MM-DD"),
      startTimeFormatted: "",
      endTimeFormatted: "",
      timeslotLength: "60",
      datePickerOpen: false,
      startTimePickerOpen: false,
      endTimePickerOpen: false,
    };
  },

  methods: {
    async submit(date, startTime, endTime, timeslotLength) {
      const timeslotDate = dayjs(date);
      const startDate = timeslotDate
        .add(startTime.split(":")[0], "hours")
        .add(startTime.split(":")[1], "minutes");
      const endDate = timeslotDate
        .add(endTime.split(":")[0], "hours")
        .add(endTime.split(":")[1], "minutes");
      this.$axios.$post("/api/setup", {
        startTime: startDate.valueOf(),
        endTime: endDate.valueOf(),
        timeslotLength: timeslotLength,
      });
    },
  },
};
</script>
