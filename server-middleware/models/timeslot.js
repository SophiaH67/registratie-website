const mongoose = require('mongoose')
const Schema = mongoose.Schema

const timeslotSchema = new Schema({
  startTimeUnix: {
    type: Number,
    required: true
  },
  endTimeUnix: {
    type: Number,
    required: false
  },
  families: {
    type: [{
      name: String,
      picture: String,
      amountOfPeople: Number
    }]
  }
})

const Timeslot = mongoose.model('Timeslot', timeslotSchema)
module.exports = Timeslot