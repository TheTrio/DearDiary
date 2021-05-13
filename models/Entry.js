const mongoose = require('mongoose')

const Schema = mongoose.Schema

const entrySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    Delta: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    _id: {
        type: String,
        required: true,
    },
    next: {
        type: String,
    },
    prev: {
        type: String,
    },
})

const Diary = mongoose.model('Entry', entrySchema)
module.exports = Diary
