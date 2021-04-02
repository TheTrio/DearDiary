var CryptoJS = require("crypto-js");

const encryptEntry = (Delta, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(Delta), key).toString();
}

const decryptEntry = (encrText, key) => {
    var bytes = CryptoJS.AES.decrypt(encrText, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = { encryptEntry, decryptEntry }