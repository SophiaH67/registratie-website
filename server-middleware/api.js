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
  useFindAndModify: false,
  user: dbuser,
  pass: dbpassword
})
  .then((result) => console.log("\x1b[32m✔\x1b[0m Connected to db"))
  .catch((err) => console.error(err))

app.all('/getTimeslots', async (req, res) => {
  const timeslots = await Timeslot.find().sort({startTimeUnix: 1})
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

  if(!isBase64(picture, {mimeRequired: true})) return reject("Er was een probleem met jouw foto")
  // compress pfp
  let parts = picture.split(';');
  let imageData = parts[1].split(',')[1];
  var img = Buffer.from(imageData, 'base64');
  resizedImageBuffer = await sharp(img).resize(64, 64).webp({quality: 80}).toBuffer()
  let resizedImageData = resizedImageBuffer.toString('base64');
  let resizedBase64 = `data:image/webp;base64,${resizedImageData}`;
  // save pfp
  const profilePicture = new Picture({
    picture: resizedBase64
  })
  pictureID = (await profilePicture.save())._id
  // save id of pfp in database
  let family = {}
  family.name = name
  family.amountOfPeople = amountOfPeople
  family.picture = pictureID
  Timeslot.findOneAndUpdate(
    {_id: slotID},
    {$push: {families: family}}
  )
  res.status(200)
  res.send(JSON.stringify({status:'ok'}))
  res.end()
})

app.post('/setup', (req, res) => {
  const startTime = req.body.startTime
  const endTime = req.body.endTime
  const timeslotLength = req.body.timeslotLength
  const timeslotLengthMS = req.body.timeslotLength * 60 * 1000

  const diffMinutes = (endTime - startTime) / 1000 / 60;
  
  const amountOfTimeslots = Math.floor(diffMinutes / timeslotLength)
  for (let i = 0; i < amountOfTimeslots; i++) {
    const timeslotStartTime = startTime + i*timeslotLengthMS
    const timeslotEndTime = timeslotStartTime + timeslotLengthMS
    const timeslot = new Timeslot({
      startTimeUnix: timeslotStartTime,
      endTimeUnix: timeslotEndTime,
      family: []
    })
    timeslot.save()
      .catch((err) => console.error(err))
  }
  res.status(200)
  res.end()
  
})

app.get('/getPicture', async (req, res) => {
  const targetID = req.query.id
  const pictureData = (await Picture.findById(targetID))?.picture.replace(/^data:image\/webp;base64,/, '')
  if(!pictureData) {
    res.status(400)
    res.end()
  }
  const picture = Buffer.from(pictureData, 'base64')
  
  res.status(200, {
    'Content-Type': 'image/png',
    'Content-Length': picture.length
  })
  res.end(picture)
})

module.exports = app