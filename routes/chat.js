const express = require('express');
const app = express();
const routes = express.Router();
const signature = require('../signature');
const http = require('http');
const server = http.Server(app);
const users = require('../model/users');
const socketIO = require('socket.io');
const io = socketIO(server);
const port = process.env.PORT || 4000;
const userHistory = require('../model/userHistory');

io.on('connection', (socket) => {
    console.log('user joined chat');

    socket.on('new-message', (output) => {
        console.log(output);
        socket.join(output.emailTrans);

        signature.verifySignature(output.email, output.message, output.signature).then((res) => {
            console.log(res);
            let name ='';
            let sigOut = '';
            if(res) {
                users.findOne({"email": output.email}).populate('userHistory').then((user) => {
                   name = user.firstName + ' ' + user.lastName;
                   user.userHistory.chatHistory.push({
                       date: Date.now(),
                       message: output.message,
                       room: output.emailTrans
                   });
                   user.userHistory.save();

                    signature.signSignature(output.message).then((sig) => {
                        sigOut = sig;
                        let emit ={
                            // email: output.email,
                            name: name,
                            message: output.message,
                            signature: sigOut
                        };
                         io.to(output.emailTrans).emit('new-message', emit);
                    });
                });
            } else {
                console.log('Signature does not match!');
            }
        }).catch((err) => {
        });
    });

    socket.on('streamer-message', (output) => {
        console.log(output);
        socket.join(output.emailTrans);

        users.findOne({"email": output.email}).populate('userHistory').then((user) => {
            let name = user.firstName + ' ' + user.lastName;
            user.userHistory.chatHistory.push({
                date: Date.now(),
                message: output.message,
                room: output.emailTrans
            });
            user.userHistory.save();

            signature.signSignature(output.message).then((sig) => {
                sigOut = sig;
                let emit ={
                    // email: output.email,
                    name: name,
                    message: output.message,
                    signature: sigOut
                };
                io.to(output.emailTrans).emit('new-message', emit);
            });
        });
    });
    });

server.listen(port, () => {
    console.log(`Chat server running fine on: ${port}`);
});

module.exports = routes;