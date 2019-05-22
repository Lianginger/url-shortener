const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/urlShortener', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('MongoDB id connected!')
})

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', require('./routes/home'))

app.listen(port, () => {
  console.log(`Express is runnig on ${port}`)
})