const express = require('express')
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware')
const { wrapAsync } = require('../utils/wrapAsync')
const { decryptEntry } = require('../utils/crypto')

const router = express.Router()

router.get('/entry/:id', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    const { _id, Delta, date, title, owner } = req.entry
    const decryptedEntry = decryptEntry(Delta, req.session.key)
    const entry = { _id, Delta: decryptedEntry, date, title, owner }
    if (entry === null) {
        throw new AppError('No such Entry found', 404)
    }
    res.send(entry)
}))

module.exports = router