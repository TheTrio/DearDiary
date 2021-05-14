const express = require('express')
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware')
const { wrapAsync } = require('../utils/wrapAsync')
const Entry = require('../models/Entry')
const uuid = require('uuid')
const { encryptEntry } = require('../utils/crypto')

const router = express.Router()

router.get(
    '/new',
    isLoggedIn,
    wrapAsync(async (req, res) => {
        Entry.find({ owner: req.user })
            .sort({ date: -1 })
            .limit(4)
            .exec((err, docs) => {
                res.render('entries/new', { entries: docs })
            })
    })
)

router.get(
    '/random',
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const len = req.user.entryCount
        Entry.findOne({ owner: req.user })
            .skip(Math.floor(Math.random() * len))
            .exec((e, d) => {
                res.redirect(`/entry/${d._id}`)
            })
    })
)

router
    .route('/:id')
    .get(
        isLoggedIn,
        isEntryAuthor,
        wrapAsync(async (req, res) => {
            const { id } = req.params
            Entry.find({ owner: req.user })
                .sort({ date: -1 })
                .limit(4)
                .exec((err, docs) => {
                    res.render('entries/home', { entries: docs, id })
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
            const { Delta, title } = req.body
            const encryptedDelta = encryptEntry(Delta, req.session.key)
            const entry = req.entry
            if (encryptedDelta !== entry.Delta) {
                entry.Delta = encryptedDelta
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
        const { Delta, date, title } = req.body
        const encryptedDelta = encryptEntry(Delta, req.session.key)
        const entry = new Entry({ Delta: encryptedDelta, date, title })
        entry.owner = req.user._id
        entry._id = uuid.v4()
        if (req.user.entryCount !== 0) {
            let lastEntry = await Entry.find({ owner: req.user, date: { $lte: date } })
                .sort({ date: -1 })
                .limit(1)
            lastEntry = lastEntry[0]
            if (lastEntry === null) {
                const firstEntry = await Entry.find({ owner: req.user }).sort({ date: 1 }).limit(1)
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
        console.log('EDITING')
        const { id } = req.params
        let entry = -1
        if (id != undefined) {
            entry = await Entry.findById(id)
            if (entry == null) {
                throw new routerError('No such Entry found', 404)
            }
        }
        Entry.find({ owner: req.user })
            .sort({ date: -1 })
            .limit(4)
            .exec((err, docs) => {
                res.render('entries/edit', { entries: docs, id })
            })
    })
)

module.exports = router
