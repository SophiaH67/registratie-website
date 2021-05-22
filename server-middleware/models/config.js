const mongoose = require('mongoose')
const Schema = mongoose.Schema

const configSchema = new Schema({
  maxAmountOfPeople: {
    type: Number,
    required: true
  },
  setupDone: {
    type: Boolean,
    required: true
  }
})

const Config = mongoose.model('Config', configSchema)
module.exports = Config