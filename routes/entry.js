const express = require('express')
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware')
const { wrapAsync } = require('../utils/wrapAsync')
const Entry = require('../models/Entry')
const uuid = require('uuid')


const router = express.Router()

router.get('/new', isLoggedIn, wrapAsync(async (req, res) => {
	Entry.find({ owner: req.user }).sort({ date: -1 }).exec((err, docs) => {
		docs = docs.slice(0, 4)
		res.render('new', { entries: docs })
	})
}))

router.get('/random', isLoggedIn, wrapAsync(async (req, res) => {
	const len = req.user.entryCount
	Entry.findOne({ owner: req.user }).skip(Math.floor(Math.random() * len)).exec((e, d) => {
		res.redirect(`/entry/${d._id}`)
	})
}))

router.route('/:id')
	.get(isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
		const entry = req.entry
		const { id } = req.params
		Entry.find({ owner: req.user }).sort({ date: -1 }).exec((err, docs) => {
			console.log(`Results are ${docs}`)
			let out = []
			docs = docs.slice(0, 5)
			for (let entry of docs) {
				out.push(JSON.stringify(entry))
			}
			let included = out.includes(JSON.stringify(entry))
			if (id === undefined) {
				id = -1
			}
			if (included) res.render('home', { entries: docs, id, included: true })
			else res.render('home', { entries: docs.slice(0, 4), id, included: false })
		})
	}))
	.delete(isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
		console.log('TRYING TO DELETE')
		const { id } = req.params
		await Entry.findByIdAndRemove(id)
		console.log('DELETED')
		res.send('Deleted')
	}))
	.patch(isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
		const { id } = req.params
		const entry = new Entry(req.body)
		entry._id = id
		await Entry.findByIdAndUpdate(id, entry, { overwrite: true })
		console.log('DONE')
		res.send('DONE!')
	}))


router.post('/', isLoggedIn, wrapAsync(async (req, res) => {
	const { Delta, date, title } = req.body
	const entry = new Entry({ Delta, date, title })
	req.user.entryCount = req.user.entryCount + 1
	await req.user.save()
	entry.owner = req.user._id
	entry._id = uuid.v4()
	await entry.save()
	res.send({ entry })
}))

router.get('/:id/edit', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
	console.log('EDITING')
	const { id } = req.params
	let entry = -1
	if (id != undefined) {
		entry = await Entry.findById(id)
		if (entry == null) {
			throw new routerError('No such Entry found', 404)
		}
	}
	Entry.find({}).sort({ date: -1 }).exec((err, docs) => {
		let out = []
		docs = docs.slice(0, 5)
		for (let entry of docs) {
			out.push(JSON.stringify(entry))
		}
		let included = out.includes(JSON.stringify(entry))
		if (included) res.render('edit', { entries: docs, id, included: true })
		else res.render('edit', { entries: docs.slice(0, 4), id, included: false })
	})
}))

module.exports = router