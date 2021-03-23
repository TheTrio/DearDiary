const express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require('path');
const ejsEngine = require('ejs-mate')
const Entry = require('./models/Entry')
const uuid = require('uuid')
const { wrapAsync } = require('./utils/wrapAsync')
const AppError = require('./utils/AppError')
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/User')
const flash = require('connect-flash');
const { isLoggedIn, isEntryAuthor } = require('./utils/Middleware')

mongoose.connect('mongodb://localhost:27017/DiaryEntries', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected!')
    }).catch((e) => {
        console.log('Error')
        console.log(e)
    });

const sessionConfig = {
    secret: 'c7F4ZEVVPN0GuJU',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.engine('ejs', ejsEngine)

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/', (req, res) => {
    res.render('homepage')
})

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/entry/new')
    }
    res.render('login')
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(async (req, res) => {
    res.redirect('/entry/new')
}))

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', wrapAsync(async (req, res) => {
    const { username, password, email } = req.body
    const user = new User({ username, email, entryCount: 0 })
    const registeredUser = await User.register(user, password)
    res.redirect('/login')
}))
app.get('/entry/new', isLoggedIn, wrapAsync(async (req, res) => {
    Entry.find({ owner: req.user }).sort({ date: -1 }).exec((err, docs) => {
        docs = docs.slice(0, 4)
        res.render('new', { entries: docs })
    })
}))

app.get('/entry/random', isLoggedIn, wrapAsync(async (req, res) => {
    const len = req.user.entryCount
    Entry.findOne({ owner: req.user }).skip(Math.floor(Math.random() * len)).exec((e, d) => {
        res.redirect(`/entry/${d._id}`)
    })
}))

app.get('/entry/:id', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
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

app.post('/entry', isLoggedIn, wrapAsync(async (req, res) => {
    const { Delta, date, title } = req.body
    const entry = new Entry({ Delta, date, title })
    req.user.entryCount = req.user.entryCount + 1
    await req.user.save()
    entry.owner = req.user._id
    entry._id = uuid.v4()
    await entry.save()
    res.send({ entry })
}))

app.get('/api/entry/:id', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    const entry = req.entry
    if (entry === null) {
        throw new AppError('No such Entry found', 404)
    }
    res.send(entry)
}))

app.get('/entry/:id/edit', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
    console.log('EDITING')
    const { id } = req.params
    let entry = -1
    if (id != undefined) {
        entry = await Entry.findById(id)
        if (entry == null) {
            throw new AppError('No such Entry found', 404)
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

app.patch('/entry/:id', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    const entry = new Entry(req.body)
    entry._id = id
    await Entry.findByIdAndUpdate(id, entry, { overwrite: true })
    console.log('DONE')
    res.send('DONE!')
}))

app.delete('/entry/:id', isLoggedIn, isEntryAuthor, wrapAsync(async (req, res) => {
    console.log('TRYING TO DELETE')
    const { id } = req.params
    await Entry.findByIdAndRemove(id)
    console.log('DELETED')
    res.send('Deleted')
}))


app.use((err, req, res, next) => {
    const { status = 500, name = 'Something went wrong' } = err
    console.log('OOPS')
    res.status(status).render('error', { status, name })
})
app.listen(3000, () => {
    console.log('Listening at port 3000')
})