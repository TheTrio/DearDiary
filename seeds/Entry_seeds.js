const mongoose = require('mongoose');
const Entry = require('./../models/Entry')

mongoose.connect('mongodb://localhost:27017/DiaryEntries', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected!')
    }).catch((e) => {
        console.log('Error')
        console.log(e)
    });

// delta = Entry.findById('604001e065053315bcd94b90').then(async () => {
//     await Entry.insertMany([
//         { username: 'Shashwat', Delta: delta.Delta, date: new Date(2021, 2, 4), title: 'Bad day' },
//         { username: 'Shashwat', Delta: delta.Delta, date: new Date(2021, 2, 5), title: 'Good day' },
//         { username: 'Shashwat', Delta: delta.Delta, date: new Date(2021, 2, 6), title: 'Worst day' },
//         { username: 'Shashwat', Delta: delta.Delta, date: new Date(2021, 2, 7), title: 'No virgin day' },
//         { username: 'Shashwat', Delta: delta.Delta, date: new Date(2021, 2, 8), title: 'Nut day' },
//     ])
// })

// Entry.find({}).sort({ date: -1 }).exec((err, docs) => {
//     console.log(typeof docs)
// })