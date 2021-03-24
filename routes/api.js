const express = require('express')
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware')
const { wrapAsync } = require('../utils/wrapAsync')

const router = express.Router()

router.get('/entry/:id', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
	const { id } = req.params
	const entry = req.entry
	if (entry === null) {
		throw new AppError('No such Entry found', 404)
	}
	res.send(entry)
}))

module.exports = router