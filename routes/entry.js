const express = require('express')
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware')
const { wrapAsync } = require('../utils/wrapAsync')
const Entry = require('../models/Entry')
const uuid = require('uuid')
const { encryptEntry, decryptEntry } = require('../utils/crypto')

const router = express.Router()

router.get(
  '/new',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    Entry.find({ owner: req.user })
      .sort({ date: -1 })
      .limit(4)
      .exec((err, docs) => {
        res.render('entries/new', {
          entries: docs,
          theme: req.user.theme,
          nextEntries: [],
          prevEntries: [],
          currentEntry: {
            title: 'Unsaved Entry',
            date: new Date(),
            _id: 'unsaved_entry',
          },
        })
      })
  })
)

router.get(
  '/random',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const len = req.user.entryCount
    if (len <= 0) {
      res.redirect('/entry/new')
      return
    }
    Entry.findOne({ owner: req.user })
      .skip(Math.floor(Math.random() * len))
      .exec((e, d) => {
        res.redirect(`/entry/${d._id}`)
      })
  })
)
router.get(
  '/all',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const sortBy = req.query.sort || 'date'
    const entries = await Entry.find({ owner: req.user }).sort({ [sortBy]: -1 })
    if (sortBy === 'length') {
      const decryptedEntries = entries.map((entry) => ({
        title: entry.title,
        date: entry.date,
        _id: entry._id,
        markdown: decryptEntry(entry.markdown, req.session.key),
      }))
      decryptedEntries.sort(
        (a, b) =>
          b.markdown.split(/\s+/).length - a.markdown.split(/\s+/).length
      )
      res.render('entries/all', {
        entries: decryptedEntries,
      })
    } else {
      res.render('entries/all', {
        entries,
      })
    }
  })
)
router.get(
  '/export.json',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const decrypt = req.query.decrypt

    const entries = await Entry.find({ owner: req.user }).sort({ date: 1 })

    const result_entries = entries.map((entry) => {
      const { _id, date, title, owner, prev = null, next = null } = entry
      let markdown = entry.markdown
      if (decrypt) {
        markdown = decryptEntry(entry.markdown, req.session.key)
      }
      return {
        _id,
        date,
        title,
        owner,
        prev,
        next,
        markdown,
      }
    })
    res.send(result_entries)
  })
)

router
  .route('/:id')
  .get(
    isLoggedIn,
    isEntryAuthor,
    wrapAsync(async (req, res) => {
      const { id } = req.params
      const promises = []
      promises.push(
        Entry.find({
          owner: req.user,
          date: { $lt: req.entry.date },
        })
          .sort({ date: -1 })
          .limit(2)
          .exec()
      )
      promises.push(
        Entry.find({
          owner: req.user,
          date: { $gt: req.entry.date },
        })
          .sort({ date: 1 })
          .limit(2)
          .exec()
      )
      promises.push(
        Entry.find({ owner: req.user })
          .sort({
            date: -1,
          })
          .limit(2)
          .exec()
      )
      const [prevEntries, nextEntries, recentEntries] = await Promise.all(
        promises
      )
      const decryptedMarkdown = decryptEntry(
        req.entry.markdown,
        req.session.key
      )
      const entry = {
        ...(await req.entry.toJSON()),
        markdown: decryptedMarkdown,
      }
      function utf8_to_b64(str) {
        return btoa(unescape(encodeURIComponent(str)))
      }

      res.render('entries/home', {
        entries: recentEntries,
        id,
        entry: utf8_to_b64(JSON.stringify(entry)),
        currentEntry: entry,
        theme: req.user.theme,
        prevEntries,
        nextEntries,
      })
    })
  )
  .delete(
    isLoggedIn,
    isEntryAuthor,
    wrapAsync(async (req, res) => {
      const { id } = req.params
      const entry = req.entry
      const prevEntry = await Entry.findById(entry.prev)
      const nextEntry = await Entry.findById(entry.next)
      if (prevEntry !== null && nextEntry !== null) {
        prevEntry.next = nextEntry._id
        nextEntry.prev = prevEntry._id
        await prevEntry.save()
        await nextEntry.save()
      } else if (nextEntry === null) {
        prevEntry.next = undefined
        await prevEntry.save()
      } else {
        nextEntry.prev = undefined
        await nextEntry.save()
      }
      await entry.delete()
      req.user.entryCount = req.user.entryCount - 1
      await req.user.save()
      res.send('Deleted')
    })
  )
  .patch(
    isLoggedIn,
    isEntryAuthor,
    wrapAsync(async (req, res) => {
      const { markdown, title } = req.body
      const encryptedMarkdown = encryptEntry(markdown, req.session.key)
      const entry = req.entry
      entry.words = markdown.split(/\s+/).length
      entry.chars = markdown.length
      if (encryptedMarkdown !== entry.markdown) {
        entry.markdown = encryptedMarkdown
      }
      if (entry.title !== title) entry.title = title
      await entry.save()
      res.send('DONE!')
    })
  )

router.post(
  '/',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { date, title, markdown } = req.body
    const encryptedMarkdown = encryptEntry(markdown, req.session.key)
    const entry = new Entry({
      markdown: encryptedMarkdown,
      date,
      title,
      words: markdown.split(/\s+/).length,
      chars: markdown.length,
    })
    entry.owner = req.user._id
    entry._id = uuid.v4()
    if (req.user.entryCount !== 0) {
      let lastEntry = await Entry.find({
        owner: req.user,
        date: { $lte: date },
      })
        .sort({ date: -1 })
        .limit(1)
      lastEntry = lastEntry[0]
      if (lastEntry === null) {
        const firstEntry = await Entry.find({ owner: req.user })
          .sort({ date: 1 })
          .limit(1)
        entry.next = firstEntry._id
        firstEntry.prev = entry._id
      } else {
        const lastEntryNextId = lastEntry?.next
        const lastEntryNext = await Entry.findById(lastEntryNextId)
        if (lastEntryNext !== null) lastEntryNext.prev = entry._id
        lastEntry.next = entry._id
        entry.prev = lastEntry._id
        if (lastEntryNextId !== undefined) {
          entry.next = lastEntryNextId
        }
        await lastEntry.save()
        if (lastEntryNext !== null) await lastEntryNext.save()
      }
    }
    await entry.save()
    req.user.entryCount = req.user.entryCount + 1
    await req.user.save()
    res.send({ entry })
  })
)

router.get(
  '/:id/edit',
  isLoggedIn,
  isEntryAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params
    const promises = []
    promises.push(
      Entry.find({
        owner: req.user,
        date: { $lt: req.entry.date },
      })
        .sort({ date: -1 })
        .limit(2)
        .exec()
    )
    promises.push(
      Entry.find({
        owner: req.user,
        date: { $gt: req.entry.date },
      })
        .sort({ date: 1 })
        .limit(2)
        .exec()
    )
    promises.push(
      Entry.find({ owner: req.user })
        .sort({
          date: -1,
        })
        .limit(2)
        .exec()
    )
    const [prevEntries, nextEntries, recentEntries] = await Promise.all(
      promises
    )
    const decryptedMarkdown = decryptEntry(req.entry.markdown, req.session.key)
    const entry = {
      ...(await req.entry.toJSON()),
      markdown: decryptedMarkdown,
    }
    function utf8_to_b64(str) {
      return btoa(unescape(encodeURIComponent(str)))
    }
    res.render('entries/edit', {
      entries: recentEntries,
      id,
      entry: utf8_to_b64(JSON.stringify(entry)),
      currentEntry: entry,
      theme: req.user.theme,
      prevEntries,
      nextEntries,
    })
  })
)

module.exports = router
