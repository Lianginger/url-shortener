const mongoose = require('mongoose')

var urlShortenSchema = new mongoose.Schema({
  originalUrl: String,
  shortId: String,
  createdAt: String
})

module.exports = mongoose.model('UrlShorten', urlShortenSchema)