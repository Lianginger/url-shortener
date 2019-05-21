const express = require('express')
const router = express.Router()
const UrlShorten = require('../models/url-shorten')
const moment = require('moment')
const tz = require('moment-timezone')

router.get('/', (req, res) => {
  res.render('home')
})

router.post('/new', async (req, res) => {
  const hostUrl = req.headers.host
  const newOriginalUrl = req.body.originalUrl
  //驗證URL是否為真

  //存入DB
  //是否為重複的URL，如果是，直接給過去的 shortId
  const exitShortId = await findOriginalUrlInDataBaseAndReturnShortId(newOriginalUrl)
  if (exitShortId) {
    res.render('home', { hostUrl, exitShortId })
  } else {
    const newShortId = await generateUniqueShortId()
    const newUrlShorten = new UrlShorten({
      originalUrl: newOriginalUrl,
      shortId: newShortId,
      createdAt: moment().tz('Asia/Taipei').format('YYYY-MM-DD')
    })
    await newUrlShorten.save()
    res.render('home', { hostUrl, newShortId })
  }
})

router.get('/:shortId', (req, res) => {
  res.send('導向某網址')
})

module.exports = router
async function findOriginalUrlInDataBaseAndReturnShortId(newOriginalUrl) {
  const exitOriginalUrl = await UrlShorten.findOne({ originalUrl: newOriginalUrl }).exec()
  if (exitOriginalUrl) {
    return exitOriginalUrl.shortId
  } else {
    return null
  }
}

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