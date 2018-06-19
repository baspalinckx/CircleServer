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
            let name ='';
            let sigOut = '';
            if(res) {
                users.findOne({"email": output.email}).populate('userHistory').then((user) => {
                   name = user.firstName;
                   user.userHistory.chatHistory.push({
                       date: Date.now(),
                       message: output.message,
                       room: output.emailTrans
                   });
                   user.userHistory.save();

                    signature.signSignature(output.message).then((sig) => {
                        sigOut = sig;
                        console.log(sig);

                        let emit ={
                            // email: output.email,
                            name: name,
                            message: output.message,
                            signature: sigOut
                        };
                        console.log(emit);
                         io.to(output.emailTrans).emit('new-message', emit);
                    });
                });

            } else {
                console.log('Signature does not match!');
            }

        }).catch((err) => {
        });
    });
    });

server.listen(port, () => {

    console.log(`Chat server running fine on: ${port}`);
});

module.exports = routes;
