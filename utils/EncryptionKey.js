const crypto = require('crypto')

const makeHash = (req, res, next) => {
    var hash = crypto.createHmac('sha512', req.user.email);
    hash.update(req.body.password);
    req.session.key = hash.digest('hex')
}

module.exports = makeHash