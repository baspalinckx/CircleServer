const NodeMediaServer = require('node-media-server');
const Signature = require('./signature');
let config = require('./config/env/env');
const users = require('./model/users');

function startMediaServer() {
    let nms = new NodeMediaServer(config.configStream);
    nms.run();

    nms.on('prePublish', (id, StreamPath, args) => {
        let email = StreamPath.replace('/live/', '');
        let session = nms.getSession(id);

        console.log(email);
        console.log(args.signature);

        users.findOne({"email": email}).then((user) => {
           if(user.transparent){
               Signature.verifySignature(email, email, args.signature).then((res) => {
                   if(!res){
                       session.reject();
                   }
               }).catch((err) => {
                   session.reject();
                   console.log(err);
               })
           }else {
               session.reject();
           }
        }).catch((res) => {
            session.reject();
        });


    });
}

module.exports = {
    start: function () {
        startMediaServer()
    }
};