const mongoose = require('mongoose')

const Schema = mongoose.Schema

const entrySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
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
    markdown: {
        type: String,
        required: true,
    },
})

const Diary = mongoose.model('Entry', entrySchema)
module.exports = Diary
