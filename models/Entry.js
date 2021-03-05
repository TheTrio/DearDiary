const mongoose = require('mongoose')

const Schema = mongoose.Schema

const entrySchema = new Schema({
    username: {
        type: String,
        required: true
    },
    Delta: [{
        type: Schema.Types.Map,
        required: true
    }],
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: true
    }
})

const Diary = mongoose.model('Entry', entrySchema)
module.exports = Diary