const express = require('express')
const passport = require('passport')
const { wrapAsync } = require('../utils/wrapAsync')
const User = require('../models/User')
const makeHash = require('../utils/EncryptionKey')
const rateLimit = require('express-rate-limit')

const router = express.Router()

/* Rate limits*/

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 2,
    message: 'Too many accounts created from this IP, please try again later',
})

const loginAttempsLimit = rateLimit({
    windowMs: 60 * 1000 * 1000,
    max: 10,
    message: 'Too many attempts at sign in. Try again later',
})

// Login routes
router
    .route('/login')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect('/entry/new')
        }
        res.render('login/login')
    })
    .post(
        loginAttempsLimit,
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
        }),
        wrapAsync(async (req, res) => {
            makeHash(req, res)
            res.redirect('/entry/new')
        })
    )

//Register routes
router
    .route('/register')
    .get((req, res) => {
        res.render('login/register')
    })
    .post(
        createAccountLimiter,
        wrapAsync(async (req, res) => {
            try {
                const { username, password, email } = req.body
                const user = new User({ username, email, entryCount: 0 })
                const registeredUser = await User.register(user, password)
                res.redirect('/login')
            } catch (e) {
                req.flash('error', e.message)
                res.redirect('/register')
            }
        })
    )

//logout routes
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

module.exports = router
