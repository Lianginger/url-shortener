const express = require('express')
const router = express.Router()
const UrlShorten = require('../models/url-shorten')

router.get('/', (req, res) => {
  res.render('home')
})

router.post('/new', async (req, res) => {
  const newOriginalUrl = req.body.originalUrl
  const newShortId = await generateUniqueShortId()
  //驗證URL是否為真

  //存入DB
  //是否為重複的URL
  //

})

router.get('/:shortId', (req, res) => {
  res.send('導向某網址')
})

module.exports = router

async function generateUniqueShortId() {
  let isShortIdDuplicate = true
  while (isShortIdDuplicate) {
    const newShortId = Math.random().toString(36).slice(-5)
    const exitShortId = await UrlShorten.findOne({ shortId: newShortId }).exec()
    if (exitShortId) {
      console.log('ShortId duplicate, recreate one.')
    } else {
      return newShortId
      isShortIdDuplicate = false
    }
  }
}