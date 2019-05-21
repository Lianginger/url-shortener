const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('home')
})

router.post('/new', (req, res) => {
  console.log('存入新網址')
})

router.get('/:shortId', (req, res) => {
  res.send('導向某網址')
})

module.exports = router