const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const sha256 = require('sha256');
const users = require('../model/users');
const config = require('../config/env/env');
const jwt = require('jsonwebtoken');
const baseURL = 'rtmp://188.166.29.146/live/';
const keypair = require('keypair');
const userHistory = require('../model/userHistory');

const generateSignature = require('../signature');

routes.get('/getallusers', function (req, res) {
    users.find().then((users) => {
        res.status(200).json({
            "status": true,
            "result": users
        })
    }).catch((err) => {
        res.status(200).json({
            "status": false,
            "result": err
        })
    })
});

routes.delete('/deleteallusers', function (req, res) {
    users.find({}).remove().then((response) => {
        res.status(200).json({
            "status": true,
            "result": response
        })
    }).catch((err) => {
        res.status(200).json({
            "status": false,
            "result": err
        })
    })
});

routes.post('/register', function (req, res) {
    let pair = keypair();
    const body = req.body;

    if(body.email && body.firstName && body.lastName  && body.password && body.transparent !== null){
        bcrypt.genSalt(5).then((salt) => {
            let hashedPass = sha256(salt + body.password);
            let userhistory = new userHistory;
            userhistory.save();

            const userProps = {
                'email': body.email,
                'firstName': body.firstName,
                'lastName': body.lastName,
                'salt': salt,
                'password': hashedPass,
                'transparent': body.transparent,
                'publickey': body.publickey || pair.public,
                'userHistory': userhistory
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
    //let privatekey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAmWzxhqioVtNaiSDQhwSi4FAp62ipygRNgDkmLqAWx1gKLip5dcm+JZs0\nfKC1dSvqiyaB/X116OwGEAoR9RVG5/uUNPj5o+UNqbVVj6Ne2/KCyh+E0MCUA18cXJhCz4JU\nFMVZt2UZIMNu12qjnCfU1WFeI8pIY5qN617z3e2JWIVyfHBPfxFXCd/KTLwCiIHV13MHH4Or\npRWH0KsgexGaAjDn7ZDf7NcOtVToJrT6C30xypSb+kzHmsP+YlIDeRv4wM+RFs9puBMymRjr\nsrAGOMK9Zk+8J+HChyQNWoO09uayXFA287c4yupKeGtWVyrkHG8bsiNwYfwd+QmbB8JsiQID\nAQABAoIBAGzhSIIkvNppQW3hcLrwylnf6e/bJetspEdjxzn9eEzdqNPcZrf1hNCRVW1Aa6YM\nlXVMzaFEYOH8Zc0KKHZCNEC7ZBE3w4nRKqIOQvsdmFsEvlaMiafPkvrVi34WvAshVWQsLaAd\nyfhbWRTc4+EUz1DiuXkyu66b5y1rBCuxv++mIZsjQ2bpRzCS05+8sRTiJ9TyfAjtUQQJbhu4\nX8xWpq9X0oBEXKD92m9+sR1iVGwfwinhBGu1nI8rmFV6tV1ECaM9QnihOydefkm3L0GP6u+m\ng+PNFjehbtNwgXBR1b+IhMmgtLk6ivgyJKgxezdxS2aJjeRc3OHjAxP91EyshgUCgYEA3FXE\nH15kwxHwzQw4M/6JNyZ015zflCxj9YMjDNSAg7ZTTWs1EteMl02NQhpVccSZROHf98APfdK8\ncrc9WNcGwoXd2NZQchP6wqe7AyMtAoX6DirtVcKtzsUHDdDc5D3Psk9x+hzwCyITsU4MsDSI\nADft9QBUMWAFjNU13OVC7GcCgYEAskKV78UwUU/l2dyX526JUDMH0A7LmhkK8x9zyl+TPqHI\n/wuCoQv2w/lUZWC1MQUj7Y99oqH8BxIARYgtexew9ly5iIe5MAjs5QHjXyLHVjMJkmSlEtdo\nht9nx8p/FE70ScpsQKBVW++KYBsgpWompzxravLPsjVyD9aRsePxSY8CgYEAm+AhK4AAEPD0\nRlvKtx3vvRB7wL2+fnkZDmuDtGPxtzyZmj+qAHZ1g+TddlJi+GV5eP3DEObTDtSzdQSlZeBZ\na+yAkhKsPshbsrIu331XLl3SFYvQ88cSZyGEaAXG/8Gq2h7SJ3upZnbpL5pj55SCUoU+1wEw\nju27f3Km9GtM+SkCgYEAixsW8kLIz8svrPFNwRYrJWCNKjlBfQEp4EudCkHHH8sUlKKgz5gM\neyXoTCxJePVv8gRVoEIT8FiFybzY8QOt3rLBPd/cDbYJVzRAAI+dSpENWSYdAzUBpq5TyD8n\nJ+vtCmBiVZRIyDOHojPJKAxMGZk2ogDVP1YhqmZgz5b3RdUCgYAHf/jGnEH0ur/Md8jVxKwi\n5bbraTT0uoPvG5oke7BFOTFc4+z/+NoSTY5Jb3hGVQfCKa2T3jRXtFxre1Y9eTzfUBzrcPwf\nz/I91yb2gGwL+CclmqhztM5Sr2Ugz0zFwUpBlHav55Ij1UO0vNdxELbWoDMlG2pLPieyT225\n3JTrLg==\n-----END RSA PRIVATE KEY-----\n";
    generateSignature.signSignature(body.email, body.privatekey).then((signature) => {
        generateSignature.verifySignature(body.email, body.email, signature).then((response) => {
            res.status(200).json({
                "status": response,
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
   if(body.email && body.signature){
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
           res.status(200).json({
               "status": false,
               "result": "user does not exist"
           });
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