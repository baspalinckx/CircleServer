const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const sha256 = require('sha256');
const users = require('../model/users');
const config = require('../config/env/env');
const jwt = require('jsonwebtoken');
const baseURL = 'rtmp://188.166.29.146/live/';
const keypair = require('keypair');

const generateSignature = require('../signature');

routes.post('/register', function (req, res) {
    let pair = keypair();
    const body = req.body;

    if(body.email && body.firstName && body.lastName  && body.password && body.transparent !== null){
        bcrypt.genSalt(5).then((salt) => {
            let hashedPass = sha256(salt + body.password);

            const userProps = {
                'email': body.email,
                'firstName': body.firstName,
                'lastName': body.lastName,
                'salt': salt,
                'password': hashedPass,
                'transparent': body.transparent,
                'publickey': pair.public
            };

            users.create(userProps)
                .then((user) => {
                    res.status(200).json({
                        "status": true,
                        "result": {
                            "user": user,
                            "privatekey": pair.private
                        }
                    })
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).json({
                        "status": false,
                        "result": error
                    });
                });
        });
    }
    else {
        res.status(400).json({
            "status": false,
            "result": "Credentials aren't given, the required parameters are: email, firstName, lastName, password, transparent"
        })
    }
});

routes.post('/salt', function (req, res) {
    const body = req.body;

    if(body.email){
        users.findOne({"email": body.email}).then((user) => {
            res.status(200).json({
                "status": true,
                "result": {
                    "email": body.email,
                    "salt": user.salt
                }
            })
        }).catch(() => {
            res.status(400).json({
                "status": false,
                "result": "User does not exist"
            })
        })
    }
    else {
        res.status(400).json({
            "status": false,
            "result": "no email given"
        })
    }
});

routes.post('/login', function(req, res) {
    const body = req.body;

    if(body.email && body.hash && body.transparent !== null){
        users.findOne({"email": body.email}).then((user) => {
            if(body.hash.toLowerCase() === user.password){
                if(user.transparent === body.transparent || body.transparent === false){

                    const payload = {
                        transparent: user.transparent,
                        name: user.firstName + " " + user.lastName,
                        id: user._id
                    };

                    let token = jwt.sign(payload, config.env.secret, {
                        expiresIn: 14400
                    });

                    let response;

                    if(user.transparent && body.transparent){
                        let sessionid = sha256('' + Math.random() * 10000000000);
                        response = {
                            'status': true,
                            'result': {
                                'token': token,
                                'streamUrl': baseURL + sessionid
                            }
                        }
                    }
                    else {
                        response = {
                            'status': true,
                            'result': token
                        }
                    }

                    res.status(200).json(response);
                }
                else {
                    res.status(400).json({
                        'status': false,
                        'result': "You are not permitted to stream"
                    })
                }
            }
            else {
                res.status(400).json({
                    'status': false,
                    'result': "password is wrong"
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(400).json({
                'status': false,
                'result': "user not found"
            })
        })
    }
    else {
        res.status(400).json({
            'status': false,
            'result': "no credentials given"
        })
    }
});

routes.post('/rsaencrypt', function (req, res) {
    const body = req.body;
    let privatekey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAy25+YKn2LCzcKPUISvrZ8FzlpmUT972/lGHhHKiGOEaGd6Vl4AeYaj1u\n1mCuRpYmDzLdi8lEgnCd3LWRyoPAimeuWEAe28UeQTDfyHcvw5D5ZE1TUPzIwwQvhevkp/V1\n98uyfydWF8Fd655NgBA/gmX5Fn/zx5jSW+LhBZQVjZFaxqWuA2YqTNovCGCHW0KBLMXmwwHq\nxkV5WYKyKL2ODXTUghMNe/zsqwlq+qtYdHj4UjqB75Io15iYR7UuRBd2w59zyEvWFv62Sgv7\nDe5e78TUZJqEmbKv531sauNY5v2qVlRVhJc8IwezLj/a5WV05CvwFOEA1m3D32ICtGnQlQID\nAQABAoIBAQCnvbFZVWvWGxtibkFrShLgnkkCfkALvJs258puDgu2ZXjFOU2af8jOeV9mR4wM\nSgyR5bhGZiwmfmO8tL7FRQRDW6Cnxh9rycrbqEguDREGagkqCpSTqAyGuXHSNKNzVvPx4jWJ\noU7dAaXG/d4bpcooZJsSUWkbAMkb2SUAq41mD6VXKRqXvAsGxx8es827N8oXiI3zuwdU906z\nJC6Od6XyTg/UDqBp8l23fpsDG/ikD67AmjB11oGQLscKG6xS5jm8V/zJITVN7+DSdRfXCJtI\n/IPJt4vqWI1/X+LLdFSPWdWJvmkLpuWHLfgadtM2i6uU8GapL4KccJ+hOsu5q0e1AoGBAP3S\nc9M3Y+IHm5CQPI/pUjidmOcLHkOpEQRk7cupOsvNE35MxHWddR275iI3l+llSTQEA6qQFbpd\nURwb9CzuiRlBksw2Drh0re2E5KskW1eUZGRwKFBRuILvtODfkN0PgRD6cZ0alJkyOMTEni4+\nLNq5PuxaNtowtq3HRBmsWPVbAoGBAM0tWmcONIg9RpZx8v14iQSTxJYJbs53joipF9AaCVM7\njYfTi6expTvBeSjykU9xOoayAZHhkXpBj/vihWS63HAh6CcljiBo0ChfVHxfHVVQ8jI8aL2l\nHY83K/AgGN0ZtTSwKuKMKqlHYWcz5rVK1Z68fohfDuyXenoJwsAQ0gTPAoGBAMHIkftZF53y\ntvdI16P7u3VUBO+oUmPPyRk0wUQzIJuGJ3LOw1MUctzPnuTS0t0zIg9fXTk0JhKRuiIeyW4g\nc3Vf1eapAtYa5ssnIbnz2PTlazwvUOf5bEgzIEJrDVtowd4nhuQt7fOEH0lC341olLAsq/ig\n663rcRz9vGVpasVvAoGAFvK1o8Ug9wPzeywvg04R9SMZ37YaYJlapcpT0YC3/kkw4To16oGh\n+3b+OCg5PGtrolkSd+CExunCUufZB5UmxpvkPUykAtf2QC25Y1e4DizJifjbtipbjgMbtPXC\nEiin7cauZTxMITbMnCBf83L1RZXLiTEomCmxFyk0UQsQkl0CgYEA6KrL6gpPysRFI6RFu3U1\nNTNxOVG7ysNY++QJE8eUmH60TaH9hmfwscv7mB5/c4Due4pgnCNhRBMSGizIDNupICrYHTP4\n2OPL2WlGZyxpMQ+pMZnLsDpMM7f87gfTo6cTvWeDS4vXm4zabtygwjBPxMzp1bkzV2wBd0/t\nuqrLPB8=\n-----END RSA PRIVATE KEY-----\n";
    generateSignature.signSignature('test', privatekey).then((signature) => {
        generateSignature.verifySignature(body.email, body.email, signature).then((res) => {
            res.status(200).json({
                "status": res,
                "signature": signature
            })
        }).catch((err) => {
            res.status(200).json({
                "status": false,
                "error": err,
                "signature": signature
            })
        })
    }).catch((err) => {
        res.status(200).json({
            "status": false,
            "error": err
        })
    });
});

routes.post('/rsalogin', function (req, res) {
   const body = req.body;
   if(body.email && body.signature && body.transparent){
       generateSignature.verifySignature(body.email, body.email, body.signature).then((response) => {
           if(response){
               if(body.transparent === true){
                   users.findOne({"email": body.email}).then((user) => {
                       if(user.transparent === true){
                           res.status(200).json({
                               "status": true,
                               "result": {
                                   "streamingurl": baseURL + user.email
                               }
                           })
                       }else {
                           res.status(200).json({
                               "status": false,
                               "result": "User is not transparent"
                           })
                       }
                   }).catch((err) => {
                       res.status(200).json({
                           "status": false,
                           "result": err
                       })
                   })
               }
               else {
                   res.status(200).json({
                       "status": true,
                       "result": true
                   })
               }
           }
           else {
               res.status(200).json({
                   "status": false,
                   "result": "signature is wrong"
               })
           }
       }).catch((err) => {
           console.log(err)
       })
   }else {
       res.status(200).json({
           "status": false,
           "result": "the email / signature / transparent arn't in the body"
       })
   }
});


module.exports = routes;