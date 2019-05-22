const express = require('express')
const router = express.Router()
const UrlShorten = require('../models/url-shorten')
const moment = require('moment')
const tz = require('moment-timezone')
const dns = require('dns')

router.get('/', (req, res) => {
  res.render('home')
})

router.post('/new', async (req, res) => {
  const baseUrl = `${req.protocol}://${req.headers.host}/`
  const newOriginalUrl = req.body.originalUrl

  try {
    //驗證URL
    let validUrl
    validUrl = new URL(newOriginalUrl)
    await isSiteExit(validUrl)

    //存入DB
    //防止有重覆的網址組合出現，重複的 URL 給過去的 shortId
    const exitShortId = await findOriginalUrlInDataBaseAndReturnShortId(newOriginalUrl)
    if (exitShortId) {
      res.render('home', { baseUrl, exitShortId })
    } else {
      const newShortId = await generateUniqueShortId()
      const newUrlShorten = new UrlShorten({
        originalUrl: newOriginalUrl,
        shortId: newShortId,
        createdAt: moment().tz('Asia/Taipei').format('YYYY-MM-DD')
      })
      await newUrlShorten.save()
      res.render('home', { baseUrl, newShortId })
    }

  } catch (err) {
    const errorMessage = '錯誤的網址！請確定網址是否正確'
    res.render('home', { errorMessage, newOriginalUrl })
  }
})

router.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId
  const originalUrl = await findOriginalUrlByShortIdAndReturnExitOriginalUrl(shortId)
  if (originalUrl) {
    res.redirect(originalUrl)
  } else {
    const baseUrl = `${req.protocol}://${req.headers.host}/`
    res.render('not-found', { baseUrl })
  }
})

module.exports = router

function isSiteExit(validUrl) {
  return new Promise((resolve, reject) => {
    dns.lookup(validUrl.hostname, err => {
      if (err) {
        return reject(false)
      }
      return resolve(true)
    })
  })
}

async function findOriginalUrlByShortIdAndReturnExitOriginalUrl(shortId) {
  const urlShorten = await UrlShorten.findOne({ shortId }).exec()
  if (urlShorten) {
    return urlShorten.originalUrl
  } else {
    return null
  }

}

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