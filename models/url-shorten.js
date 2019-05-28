const mongoose = require('mongoose')

var urlShortenSchema = new mongoose.Schema({
  originalUrl: String,
  shortId: String,
  createdAt: String,
  ogurl: String,
  ogtype: String,
  ogtitle: String,
  ogdescription: String,
  ogimage: String,
})

module.exports = mongoose.model('UrlShorten', urlShortenSchema)