const app = require('express')()
const assert = require('assert')
const mongoose = require('mongoose');
const Timeslot = require('./models/timeslot');

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

module.exports = app