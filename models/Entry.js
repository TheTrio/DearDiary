const mongoose = require('mongoose')

const Schema = mongoose.Schema

const entrySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

entrySchema.post('findOneAndRemove', (doc) => {
    console.log('DELETING', doc)
})
const Diary = mongoose.model('Entry', entrySchema)
module.exports = Diary