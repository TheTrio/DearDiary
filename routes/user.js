const express = require('express')
const passport = require('passport')
const { wrapAsync } = require('../utils/wrapAsync')
const User = require('../models/User')

const router = express.Router()

// Login routes
router.route('/login')
	.get((req, res) => {
		if (req.isAuthenticated()) {
			return res.redirect('/entry/new')
		}
		res.render('login')
	})
	.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(async (req, res) => {
		res.redirect('/entry/new')
	}))

//Register routes
router.route('/register')
	.get((req, res) => {
		res.render('register')
	})
	.post(wrapAsync(async (req, res) => {
		try {
			const { username, password, email } = req.body
			const user = new User({ username, email, entryCount: 0 })
			const registeredUser = await User.register(user, password)
			res.redirect('/login')
		} catch (e) {
			req.flash('error', e.message)
			res.redirect('/register')
		}
	}))

//logout routes
router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/login')
})


module.exports = router