const crypto = require('crypto');
const fs = require('fs');
const users = require('./model/users');
const privatePem = fs.readFileSync('./privatekey.pem', 'utf8');

module.exports = {
    verifySignature: function (email, body, signature) {
        return new Promise(function (resolve, reject) {
            if(!email || !body || !signature){
                reject("no email / body / signature is given")
            }
            else {
                users.findOne({"email": email}).then((user) => {
                    const verify = crypto.createVerify('SHA256');
                    verify.update(body).end();
                    resolve(verify.verify(user.publickey, signature, 'hex'));
                }).catch(() => {
                    reject('No user excists with this email');
                })
            }
        })
    },
    signSignature: function (body, privatekey = privatePem) {
        return new Promise(function (resolve) {
            const sign = crypto.createSign('SHA256');
            sign.update(body).end();
            const signature = sign.sign(privatekey, 'hex');
            resolve(signature);
        })
    }
};