const express = require('express')
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware')
const { wrapAsync } = require('../utils/wrapAsync')
const ImgurAnonymousUploader = require('imgur-anonymous-uploader')
const { decryptEntry } = require('../utils/crypto')

const router = express.Router()

router.get(
  '/entry/:id',
  isLoggedIn,
  isEntryAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params
    const {
      _id,
      markdown,
      date,
      title,
      owner,
      prev = null,
      next = null,
    } = req.entry
    const decryptedMarkdown = decryptEntry(req.entry.markdown, req.session.key)
    const entry = {
      _id,
      date,
      title,
      owner,
      prev,
      next,
      markdown: decryptedMarkdown,
    }
    if (entry === null) {
      throw new AppError('No such Entry found', 404)
    }
    res.send(entry)
  })
)

module.exports = router
