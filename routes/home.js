const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('home')
})

router.post('/new', (req, res) => {
  console.log(req.body)
  //驗證URL

  //存入DB

})

router.get('/:shortId', (req, res) => {
  res.send('導向某網址')
})

module.exports = router