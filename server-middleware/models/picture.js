const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pictureSchema = new Schema({
  picture: {
    type: String,
    required: true
  },
})

const Picture = mongoose.model('Picture', pictureSchema)
module.exports = Picture