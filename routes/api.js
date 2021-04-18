const express = require('express')
const { isLoggedIn, isEntryAuthor } = require('../utils/Middleware')
const { wrapAsync } = require('../utils/wrapAsync')
const ImgurAnonymousUploader = require('imgur-anonymous-uploader')

const router = express.Router()

router.get(
    '/entry/:id',
    isLoggedIn,
    isEntryAuthor,
    wrapAsync(async (req, res) => {
        const { id } = req.params
        const entry = req.entry
        if (entry === null) {
            throw new AppError('No such Entry found', 404)
        }
        res.send(entry)
    })
)

router.post(
    '/upload',
    wrapAsync(async (req, res) => {
        try {
            // converts base64 string to Buffer
            // For some reason, couldn't use the imgur API manually. Had to use this package which made things a lot simpler
            const imageBase64 = Buffer.from(req.body.image, 'base64')
            const uploader = new ImgurAnonymousUploader(
                process.env.imgurClientID
            )
            const response = await uploader.uploadBuffer(imageBase64)
            console.log(response)
            res.send(response)
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    })
)

module.exports = router
