const express = require('express')
const app = express()
const cors = require('cors');
const assert = require('assert')
const mongoose = require('mongoose');
const Timeslot = require('./models/timeslot');

app.use(express.json());
app.use(cors());

const dbhost = process.env.DB_HOST
const dbpassword = process.env.DB_PASSWORD
const dbuser = process.env.DB_USER
const dbname = process.env.DB_NAME || "registratie-website"

assert(dbhost, "Please specify a value for DB_HOST")
assert(dbpassword, "Please specify a value for DB_PASSWORD")
assert(dbuser, "Please specify a value for DB_USER")

const dbURL = `mongodb://${dbhost}:27017/${dbname}`
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => console.log("\x1b[32m✔\x1b[0m Connected to db"))
  .catch((err) => console.error(err))

app.all('/getTimeslots', (req, res) => {
  let timeslots = [
    {startTimeUnix: 1621497559886, endTimeUnix: 1621591181598, people: [{name: "marnix", picture: "https://media.discordapp.net/attachments/713394836568277008/816086489465094204/unknown.png"}]},
    {startTimeUnix: 1621497559887, endTimeUnix: 1621591181599, people: [{name: "marnix", picture: "https://media.discordapp.net/attachments/713394836568277008/816086489465094204/unknown.png"}]}
  ]
  res.send(JSON.stringify(timeslots))
})

app.post('/setup', (req, res) => {
  const startTime = req.body.startTime
  const endTime = req.body.endTime
  const current_time = new Date().getTime()
  const timeslotLength = req.body.timeslotLength

  const diffMinutes = (endTime - startTime) / 1000 / 60;
  
  const amountOfTimeslots = Math.floor(diffMinutes / timeslotLength)
  for (let i = 0; i < amountOfTimeslots; i++) {
    const timeslotStartTime = startTime + i*timeslotLength
    const timeslotEndTime = endTime + (i+1)*timeslotLength
    const timeslot = new Timeslot({
      startTimeUnix: timeslotStartTime,
      endTimeUnix: timeslotEndTime,
      family: []
    })
    timeslot.save()
      .catch((err) => console.error(err))
  }
  
})

module.exports = app