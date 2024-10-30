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
const User = require('../models/User')
const flash = require('connect-flash')
const userRoutes = require('../routes/user')
const entryRoutes = require('../routes/entry')
const errorHandler = require('../routes/error')
const mongoStore = require('connect-mongo')
const mongoSanitize = require('express-mongo-sanitize')
const Entry = require('../models/Entry')
const { wrapAsync } = require('../utils/wrapAsync')
const cors = require('cors')
/*
    Setting up everything. Boilerplate code.
*/

// Connecting to MongoDB database
const dbUrl = process.env.DB_URL || `mongodb://localhost:27017/DearDiary`
const secret = process.env.SECRET || 'secret'
const port = process.env.PORT || 3000
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
}

/* use memory store for development. */
if (process.env.ENVIRONMENT === 'PRODUCTION') {
  sessionConfig.store = mongoStore.create({
    secret,
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
  })
}

// making sure req.body is parsed correctly
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

// setting up EJS
app.set('views', path.join(__dirname, '..', 'views'))
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

// sanitizing Mongo

app.use(mongoSanitize())

// Making sure flash varaibles are available globally in all EJS templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.user = req.user
  next()
})

/* Program logic starts here */

// Rendering the home page

//App Routes
app.use('/', userRoutes)
app.use('/entry', entryRoutes)
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get(
  '/:email/:token',
  cors(corsOptions),
  wrapAsync(async (req, res) => {
    const { email, token } = req.params
    if (process.env.TOKEN !== token) {
      return res.status(401).json({ error: 'Unauthorized access' })
    }
    const user = await User.findOne({ email })
    const entries = await Entry.find({ owner: user }).sort({ date: -1 })

    res.json(
      entries.map((entry) => ({
        title: entry.title,
        date: entry.date,
        _id: entry._id,
        words: entry.words,
        chars: entry.chars,
      }))
    )
  })
)

// Global fallback error Handler
app.use(errorHandler)

// starting the server
app.listen(port, () => {
  console.log(`Listening at port ${port}`)
})
