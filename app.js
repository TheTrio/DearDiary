const express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require('path');
const ejsEngine = require('ejs-mate')
const Entry = require('./models/Entry')
const uuid = require('uuid')
const { wrapAsync } = require('./utils/wrapAsync')
const AppError = require('./utils/AppError')

mongoose.connect('mongodb://localhost:27017/DiaryEntries', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected!')
    }).catch((e) => {
        console.log('Error')
        console.log(e)
    });

app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.engine('ejs', ejsEngine)

app.get('/', wrapAsync(async (req, res) => {
    const { id } = req.query
    console.log(id)
    Entry.find({}).sort({ date: -1 }).exec((err, docs) => {
        console.log(typeof docs[0])
        res.render('home', { entries: docs.slice(0, 5), id })
    })
}))

app.post('/entry', wrapAsync(async (req, res) => {
    console.log(req.body)
    const entry = new Entry(req.body)
    entry._id = uuid.v4()
    await entry.save()
    res.send({ entry })
}))

app.get('/entry/:id', wrapAsync(async (req, res) => {
    console.log('TRYING SOMETHING')
    const { id } = req.params
    const entry = await Entry.findById(id)
    if (entry === null) {
        throw new AppError('No such Entry found', 404)
    }
    res.send(entry)
}))

app.patch('/entry/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const entry = new Entry(req.body)
    entry._id = id
    await Entry.findByIdAndUpdate(id, entry, { overwrite: true })
    console.log('DONE')
    res.send('DONE!')
}))

app.delete('/entry/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    await Entry.findByIdAndRemove(id)
    console.log('DELETED')
    res.send('Deleted')
}))

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    console.log('OOPS')
    res.status(status).send(message)
})
app.listen(80, () => {
    console.log('Listening at port 80')
})