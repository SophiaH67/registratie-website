import dayjs from 'dayjs';

export const state = () => ({
  timeslots: [],
})

export const actions = {
  async getTimeslots () {
    let timeslots = await this.$axios.$get('/api/getTimeslots')
    for(let timeslotIndex in timeslots) {
      let timeslot = timeslots[timeslotIndex];
      timeslot.registered = process.browser ? localStorage.getItem(timeslot._id) : false
      timeslot.startTime = dayjs(timeslot.startTimeUnix).format('DD MMM HH:mm');
      timeslot.endTime = dayjs(timeslot.endTimeUnix).format('HH:mm');
    }
    this.commit("timeslots/updateTimeslots", timeslots)
    this.commit("timeslots/updateRegistered")
    return timeslots
  }
}

export const mutations = {
  updateTimeslots (state, timeslots) {
    state.timeslots = timeslots
  },
  updateRegistered (state) {
    if (!process.browser) return
    for(let timeslotIndex in state.timeslots) {
      let timeslot = state.timeslots[timeslotIndex]
      timeslot.registered = !!localStorage.getItem(timeslot._id)
    }
  }
}