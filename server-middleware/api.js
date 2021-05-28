const express = require('express')
const app = express()
const cors = require('cors');
const assert = require('assert')
const mongoose = require('mongoose');
const Timeslot = require('./models/timeslot');
const Picture = require('./models/picture');
const Config = require('./models/config');
const isBase64 = require('is-base64');
const sharp = require('sharp');

app.use(express.json({limit: '50mb'}));
app.use(cors());

const dbhost = process.env.DB_HOST
const dbpassword = process.env.DB_PASSWORD
const dbuser = process.env.DB_USER
const dbname = process.env.DB_NAME || "registratie-website"

try {
  assert(dbhost, "Please specify a value for DB_HOST")
  assert(dbpassword, "Please specify a value for DB_PASSWORD")
  assert(dbuser, "Please specify a value for DB_USER")
} catch (e) {
  console.error(e)
  process.exit(1)
}

const dbURL = `mongodb://${dbhost}:27017/${dbname}`
mongoose.connect(dbURL, {
  auth: { "authSource": "admin" },
  useNewUrlParser: true, useUnifiedTopology: true,
  useFindAndModify: false,
  user: dbuser,
  pass: dbpassword
})
  .then((result) => console.log("\x1b[32m✔\x1b[0m Connected to db"))
  .catch((err) => {console.error(err); process.exit(1)})

var config
(async () => {
  try {
    var configRes = await Config.findOne()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  if(!configRes) {
    const newConfig = new Config({
      maxAmountOfPeople: 4,
    })
    await newConfig.save()
  }
  config = await Config.findOne()
})()

app.all('/getTimeslots', async (req, res) => {
  let timeslots = await Timeslot.find().sort({startTimeUnix: 1}).lean()
  for (let i = 0; i < timeslots.length; i++) {
    let timeslot = timeslots[i];
    let roomLeft = config.maxAmountOfPeople
    for (let j = 0; j < timeslot.families.length; j++) {
      let family = timeslot.families[j];
      roomLeft=roomLeft-family.amountOfPeople
      delete family.token
    }
    timeslots[i].roomLeft = roomLeft
  }
  res.send(JSON.stringify(timeslots))
})

const rand=()=>Math.random(0).toString(36).substr(2);
const token=(length)=>(rand()+rand()+rand()+rand()).substr(0,length);

app.all('/addFamily', async (req, res) => {
  function reject(err) {
    res.status(400)
    res.write(JSON.stringify({"error":err}))
    res.end()
  }
  let name = req.body.name
  if (name.length < 3) reject("Vul een naam in")
  if (name.length > 50) reject("Uw naam is te lang")
  let amountOfPeople = parseInt(req.body.amountOfPeople)
  if(amountOfPeople <= 0) reject("Vul het aantal mensen in")
  let picture = req.body.picture

  slotID = req.body.slotID
  try {
    var timeslot = await Timeslot.findById(slotID)
  } catch (e) {
    res.status(400)
    res.write(JSON.stringify({"error":"Er is iets mis gegaan, herlaad de pagina"}))
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
  let parts = picture.split(';');
  let imageData = parts[1].split(',')[1];
  var img = Buffer.from(imageData, 'base64');
  resizedImageBuffer = await sharp(img).resize(64, 64).webp({quality: 80}).toBuffer()
  let resizedImageData = resizedImageBuffer.toString('base64');
  let resizedBase64 = `data:image/webp;base64,${resizedImageData}`;
  const profilePicture = new Picture({
    picture: resizedBase64
  })
  const pictureID = (await profilePicture.save())._id
  let family = {}
  family.name = name
  family.amountOfPeople = amountOfPeople
  family.picture = pictureID
  family.token = token(32)
  await Timeslot.findOneAndUpdate(
    {_id: slotID},
    {$push: {families: family}}
  )
  res.status(200)
  res.send(JSON.stringify({token: family.token}))
  res.end()
})

app.post('/setup', (req, res) => {
  if (process.env.SETUP !== "TRUE") return res.status(404).end()
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
      .then((res) => console.log(`Added timeslot for ${timeslotStartTime}-${timeslotEndTime}`))
      .catch((err) => console.error(err))
  }
  res.writeHead(200).end()
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

app.post('/removeFamily', async (req, res) => {
  const slotID = req.body.slotID
  const token = req.body.token
  if (!slotID || !token) res.writeHead(400).end()
  await Timeslot.updateOne({ _id: slotID }, { $pull: { families: { token: token } }}, { safe: true });
  res.writeHead(200).end()
})

module.exports = app