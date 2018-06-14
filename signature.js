const crypto = require('crypto');
const fs = require('fs');
const users = require('./model/users');
const privatePem = fs.readFileSync('./privatekey.pem', 'utf8');

module.exports = {
    verifySignature: function (email, body, signature) {
        return new Promise(function (resolve, reject) {
            users.findOne({"email": email}).then((user) => {
                const verify = crypto.createVerify('SHA256');
                verify.update(body).end();
                resolve(verify.verify(user.publickey, signature, 'hex'));
            }).catch((err) => {
                reject(err);
            })
        })
    },
    signSignature: function (body, privatekey = privatePem) {
        return new Promise(function (resolve, reject) {
            const sign = crypto.createSign('SHA256');
            sign.update(body).end();
            const signature = sign.sign(privatekey, 'hex');
            resolve(signature);
        })
    }
};