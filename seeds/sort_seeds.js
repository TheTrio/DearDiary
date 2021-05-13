if (process.env.ENVIRONMENT !== 'Production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')
const Entry = require('./../models/Entry')

mongoose
    .connect(process.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('Database connected!')
    })
    .catch((e) => {
        console.log('Error')
        console.log(e)
    })

const func = async () => {
    const entries = await Entry.find().sort({ date: 1 })
    // entries[0].prev = null
    entries[0].next = entries[1]._id
    for (var i = 1; i < entries.length - 1; i++) {
        entries[i].prev = entries[i - 1]._id
        entries[i].next = entries[i + 1]._id
    }
    entries[entries.length - 1].prev = entries[entries.length - 2]._id
    // entries[entries.length - 1].next = null
    for (var i of entries) {
        i.save()
    }
    // console.log(entries)
}

func()
