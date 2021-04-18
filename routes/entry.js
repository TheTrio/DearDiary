const express = require('express');
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware');
const { wrapAsync } = require('../utils/wrapAsync');
const Entry = require('../models/Entry');
const uuid = require('uuid');
const { encryptEntry } = require('../utils/crypto');

const router = express.Router();

router.get(
    '/new',
    isLoggedIn,
    wrapAsync(async (req, res) => {
        Entry.find({ owner: req.user })
            .sort({ date: -1 })
            .limit(4)
            .exec((err, docs) => {
                res.render('entries/new', { entries: docs });
            });
    })
);

router.get(
    '/random',
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const len = req.user.entryCount;
        Entry.findOne({ owner: req.user })
            .skip(Math.floor(Math.random() * len))
            .exec((e, d) => {
                res.redirect(`/entry/${d._id}`);
            });
    })
);

router
    .route('/:id')
    .get(
        isLoggedIn,
        isEntryAuthor,
        wrapAsync(async (req, res) => {
            const entry = req.entry;
            const { id } = req.params;
            Entry.find({ owner: req.user })
                .sort({ date: -1 })
                .limit(4)
                .exec((err, docs) => {
                    res.render('entries/home', { entries: docs, id });
                });
        })
    )
    .delete(
        isLoggedIn,
        isEntryAuthor,
        wrapAsync(async (req, res) => {
            const { id } = req.params;
            await Entry.findByIdAndRemove(id);
            req.user.entryCount = req.user.entryCount - 1;
            await req.user.save();
            res.send('Deleted');
        })
    )
    .patch(
        isLoggedIn,
        isEntryAuthor,
        wrapAsync(async (req, res) => {
            const { id } = req.params;
            const { Delta, date, title } = req.body;
            const encryptedDelta = encryptEntry(Delta, req.session.key);
            const entry = new Entry({ Delta: encryptedDelta, date, title });
            entry.owner = req.user._id;
            await Entry.findByIdAndUpdate(id, entry);
            res.send('DONE!');
        })
    );

router.post(
    '/',
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const { Delta, date, title } = req.body;
        const encryptedDelta = encryptEntry(Delta, req.session.key);
        const entry = new Entry({ Delta: encryptedDelta, date, title });
        entry.owner = req.user._id;
        entry._id = uuid.v4();
        await entry.save();
        req.user.entryCount = req.user.entryCount + 1;
        await req.user.save();
        res.send({ entry });
    })
);

router.get(
    '/:id/edit',
    isLoggedIn,
    isEntryAuthor,
    wrapAsync(async (req, res) => {
        console.log('EDITING');
        const { id } = req.params;
        let entry = -1;
        if (id != undefined) {
            entry = await Entry.findById(id);
            if (entry == null) {
                throw new routerError('No such Entry found', 404);
            }
        }
        Entry.find({ owner: req.user })
            .sort({ date: -1 })
            .limit(4)
            .exec((err, docs) => {
                res.render('entries/edit', { entries: docs, id });
            });
    })
);

module.exports = router;
