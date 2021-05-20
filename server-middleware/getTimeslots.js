// const bodyParser = require('body-parser')
const app = require('express')()

// app.use(bodyParser.json())
app.all('/getTimeslots', (req, res) => {
  let timeslots = [
    {startTimeUnix: 1621497559886, endTimeUnix: 1621591181598, people: [{name: "marnix", picture: "https://media.discordapp.net/attachments/713394836568277008/816086489465094204/unknown.png"}]},
    {startTimeUnix: 1621497559887, endTimeUnix: 1621591181599, people: [{name: "marnix", picture: "https://media.discordapp.net/attachments/713394836568277008/816086489465094204/unknown.png"}]}
  ]
  res.send(JSON.stringify(timeslots))
})

module.exports = app