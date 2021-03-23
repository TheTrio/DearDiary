const User = require('../models/User')
const Entry = require('../models/Entry')
const AppError = require('./AppError')
const { wrapAsync } = require('./wrapAsync')

const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be signed in to do that')
		return res.redirect('/login')
	}
	next()
}

const isEntryAuthor = wrapAsync(async (req, res, next) => {
	const { id } = req.params
	const entry = await Entry.findById(id).populate('owner')
	console.log(entry)
	if (entry === null) {
		throw new AppError(`Sorry, that Entry doesn't exist`, 404)
	}
	if (!entry.owner.equals(req.user)) {
		throw new AppError(`Sorry, that Entry doesn't exist`, 404)
	}
	req.entry = entry
	next()
})

module.exports = { isLoggedIn, isEntryAuthor }