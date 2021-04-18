if (process.env.ENVIRONMENT !== 'Production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const ejsEngine = require('ejs-mate')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/User')
const flash = require('connect-flash')
const userRoutes = require('./routes/user')
const entryRoutes = require('./routes/entry')
const errorHandler = require('./routes/error')
const apiRoutes = require('./routes/api')
const mongoStore = require('connect-mongo')
/*
    Setting up everything. Boilerplate code.
*/

// Connecting to MongoDB database

if (process.argv[2] != 'local') {
    db = 'DiaryEntries'
} else {
    db = 'DearDiaryLocal'
}
const dbUrl = process.env.DB_URL || `mongodb://localhost:27017/${db}`
const secret = process.env.SECRET || 'secret'
mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database connected!')
    })
    .catch((e) => {
        console.log('Error')
        console.log(e)
    })

// Session config file for cookies
const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: mongoStore.create({
        secret,
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600, // time period in seconds
    }),
}

// making sure req.body is parsed correctly
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

// setting up EJS
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsEngine)

// for static files
app.use(express.static('public'))

//setting up flash and express-session
app.use(session(sessionConfig))
app.use(flash())

// User authentication using PassportJS
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Making sure flash varaibles are available globally in all EJS templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.user = req.user
    next()
})

/* Program logic starts here */

// Rendering the home page
app.get('/', (req, res) => {
    res.render('home/landingPage')
})

//App Routes
app.use('/api', apiRoutes)
app.use('/', userRoutes)
app.use('/entry', entryRoutes)

// Global fallback error Handler
app.use(errorHandler)

// starting the server
app.listen(3000, () => {
    console.log('Listening at port 3000')
})
