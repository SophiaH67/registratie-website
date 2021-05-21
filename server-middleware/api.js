const express = require('express')
const app = express()
const cors = require('cors');
const assert = require('assert')
const mongoose = require('mongoose');
const Timeslot = require('./models/timeslot');
const Picture = require('./models/picture');
const isBase64 = require('is-base64');
const sharp = require('sharp');

app.use(express.json());
app.use(cors());

const config = {
  maxAmountOfPeople: 4
}

const dbhost = process.env.DB_HOST
const dbpassword = process.env.DB_PASSWORD
const dbuser = process.env.DB_USER
const dbname = process.env.DB_NAME || "registratie-website"

assert(dbhost, "Please specify a value for DB_HOST")
assert(dbpassword, "Please specify a value for DB_PASSWORD")
assert(dbuser, "Please specify a value for DB_USER")

const dbURL = `mongodb://${dbhost}:27017/${dbname}`
mongoose.connect(dbURL, {
  auth: { "authSource": "admin" },
  useNewUrlParser: true, useUnifiedTopology: true,
  user: dbuser,
  pass: dbpassword
})
  .then((result) => console.log("\x1b[32m✔\x1b[0m Connected to db"))
  .catch((err) => console.error(err))

app.all('/getTimeslots', async (req, res) => {
  timeslots = await Timeslot.find()
  res.send(JSON.stringify(timeslots))
})

app.all('/addFamily', async (req, res) => {
  function reject(err) {
    res.status(400)
    res.write(JSON.stringify({"error":err}))
    res.end()
  }
  let name = req.body.name
  let amountOfPeople = req.body.amountOfPeople
  let picture = req.body.picture

  slotID = req.body.slotID
  try {
    var timeslot = await Timeslot.findById(slotID)
  } catch (e) {
    res.status(400)
    res.write(JSON.stringify({"error":"Er is iets mis gegaan, herlaad de pagina A.U.B."}))
    res.end()
  }

  let newAmountOfPeople = amountOfPeople
  for (let i = 0; i < timeslot.families.length; i++) {
    const family = timeslot.families[i];
    if(family.name === name) return reject("Je bent al ingeschreven voor dit tijdstip")
    newAmountOfPeople = newAmountOfPeople + family.amountOfPeople
  }
  if (newAmountOfPeople > config.maxAmountOfPeople) return reject("Er zijn te veel mensen ingeschreven voor dit moment")

  if(!isBase64(picture, {mimeRequired: true})) reject("Er was een probleem met jouw foto")
  // compress pfp
  let parts = picture.split(';');
  let imageData = parts[1].split(',')[1];
  var img = new Buffer(imageData, 'base64');
  resizedImageBuffer = await sharp(img).resize(64, 64).webp({quality: 80}).toBuffer()
  let resizedImageData = resizedImageBuffer.toString('base64');
  let resizedBase64 = `data:image/webp;base64,${resizedImageData}`;
  // save pfp
  // save id of pfp in database
})

app.post('/setup', (req, res) => {
  const startTime = req.body.startTime
  const endTime = req.body.endTime
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