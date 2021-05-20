<template>
  <div class="container">
    <Timeslot v-for="item in this.timeslots" :key="item.startTimeUnix" :startTime="item.startTime" :endTime="item.endTime" :people="item.people" />
  </div>
</template>

<script>
import Timeslot from './Timeslot';
import dayjs from 'dayjs';
export default {
  components: {
    Timeslot
  },
  data: function() {
    return {
      timeslots: []
    }
  },
  async fetch() {
    // const ip = await this.$axios.$get('http://icanhazip.com')
    let timeslots = [
      {startTimeUnix: 1621497559886, endTimeUnix: 1621591181598, people: [{name: "marnix", picture: "https://media.discordapp.net/attachments/713394836568277008/816086489465094204/unknown.png"}]},
      {startTimeUnix: 1621497559887, endTimeUnix: 1621591181599, people: [{name: "marnix", picture: "https://media.discordapp.net/attachments/713394836568277008/816086489465094204/unknown.png"}]}
    ]
    for(let timeslotIndex in timeslots) {
      let timeslot = timeslots[timeslotIndex];
      timeslot.startTime = dayjs(timeslot.startTimeUnix).format('DD MMM HH:MM');
      timeslot.endTime = dayjs(timeslot.endTimeUnix).format('HH:MM');
    }
    this.timeslots = timeslots;
  }
}
</script>

<style>
.container {
  display: grid;
  place-items: center;
}
</style>