const NodeMediaServer = require('node-media-server');
const Signature = require('./signature');
let config = require('./config/env/env');
const users = require('./model/users');
const userHistory = require('./model/userHistory');

function startMediaServer() {
    let nms = new NodeMediaServer(config.configStream);
    nms.run();

    nms.on('prePublish', (id, StreamPath, args) => {
        let email = StreamPath.replace('/live/', '');
        let session = nms.getSession(id);

        users.findOne({"email": email}).then((user) => {
            if(!user){
                session.reject();
            }
            else {
                if (user.transparent) {
                    if (args.signature) {
                        Signature.verifySignature(email, email, args.signature).then((res) => {
                            if (!res) {
                                session.reject();
                            }
                        }).catch(() => {
                            session.reject();
                        })
                    }
                    else {
                        //session.reject();
                    }
                } else {
                    session.reject();
                }
            }
        }).catch(() => {
             session.reject();
        });
    });

    nms.on('postPublish', (id, StreamPath) => {
        let email = StreamPath.replace('/live/', '');

        users.findOne({"email": email}).populate('userHistory').then((user) => {
            if(user){
                user.userHistory.streamHistory.push({
                    startTime: Date.now(),
                    endTime: null,
                    streamId: id
                });
                user.userHistory.save();
                calculateProfit(id, 1, email);
            }
        }).catch(() => {
            console.log('catched')
        });
    });

    nms.on('donePublish', (id) => {
        userHistory.find().then((userHistories) => {
            userHistories.forEach((userhistory) => {
                let streamItem = userhistory.streamHistory.find(i => i.streamId === id);
                if(streamItem){
                    streamItem.endTime = Date.now();
                    userhistory.save();
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    });

    nms.on('postPlay', (id, StreamPath, args) => {
        let email = args.user;
        if(email){
            users.findOne({"email": email}).populate('userHistory').then((user) => {
                user.userHistory.viewHistory.push({
                    startTime: Date.now(),
                    endTime: null,
                    streamId: id
                });
                user.userHistory.save();
            })
        }
    });

    nms.on('donePlay', (id, StreamPath, args) => {
        let email = args.user;
        if(email){
            users.findOne({"email": email}).populate('userHistory').then((user) => {
                user.userHistory.viewHistory.forEach((viewhistory) => {
                    if(viewhistory.streamId === id){
                        viewhistory.endTime = Date.now();
                        user.userHistory.save();
                    }
                })
            })
        }
    });
}

function calculateProfit(id, multiplyer, email){
    setTimeout(() => {
        users.findOne({"email": email}).populate('userHistory').then((user) => {
            let lastStream = user.userHistory.streamHistory.pop();
            if(lastStream.streamId === id && lastStream.endTime === null){
                if(user.satoshi){
                    user.satoshi = user.satoshi + multiplyer;
                    user.save();
                    calculateProfit(id, multiplyer * 2, email);
                }
            }
        })
    }, 5 * 60 * 1000)
}

module.exports = {
    start: function () {
        startMediaServer()
    }
};