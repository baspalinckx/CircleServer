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

var emails = [];

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
                users.findOne({"email": output.email}).then((user) => {
                   name = user.firstName;
                     console.log(name);

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
    users.find({}).select("email").then((user) => {
        user.forEach(function (email) {
            // emails[email._id] = email;
            emails.push(email.email);
        });
            console.log(emails);
    });
});

module.exports = routes;
