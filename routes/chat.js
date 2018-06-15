const express = require('express');
const app = express();
const routes = express.Router();
const signature = require('../signature');
const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);

const port = process.env.PORT || 4000;


io.on('connection', (socket) => {
    console.log('user joined chat');

    socket.on('new-message', (output) => {

        signature.verifySignature(output.email, output.message, output.signature).then((res) => {

            if(res === true) {

            }

        }).catch((err) => {

        });

        //     var privatekey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAy25+YKn2LCzcKPUISvrZ8FzlpmUT972/lGHhHKiGOEaGd6Vl4AeYaj1u\n1mCuRpYmDzLdi8lEgnCd3LWRyoPAimeuWEAe28UeQTDfyHcvw5D5ZE1TUPzIwwQvhevkp/V1\n98uyfydWF8Fd655NgBA/gmX5Fn/zx5jSW+LhBZQVjZFaxqWuA2YqTNovCGCHW0KBLMXmwwHq\nxkV5WYKyKL2ODXTUghMNe/zsqwlq+qtYdHj4UjqB75Io15iYR7UuRBd2w59zyEvWFv62Sgv7\nDe5e78TUZJqEmbKv531sauNY5v2qVlRVhJc8IwezLj/a5WV05CvwFOEA1m3D32ICtGnQlQID\nAQABAoIBAQCnvbFZVWvWGxtibkFrShLgnkkCfkALvJs258puDgu2ZXjFOU2af8jOeV9mR4wM\nSgyR5bhGZiwmfmO8tL7FRQRDW6Cnxh9rycrbqEguDREGagkqCpSTqAyGuXHSNKNzVvPx4jWJ\noU7dAaXG/d4bpcooZJsSUWkbAMkb2SUAq41mD6VXKRqXvAsGxx8es827N8oXiI3zuwdU906z\nJC6Od6XyTg/UDqBp8l23fpsDG/ikD67AmjB11oGQLscKG6xS5jm8V/zJITVN7+DSdRfXCJtI\n/IPJt4vqWI1/X+LLdFSPWdWJvmkLpuWHLfgadtM2i6uU8GapL4KccJ+hOsu5q0e1AoGBAP3S\nc9M3Y+IHm5CQPI/pUjidmOcLHkOpEQRk7cupOsvNE35MxHWddR275iI3l+llSTQEA6qQFbpd\nURwb9CzuiRlBksw2Drh0re2E5KskW1eUZGRwKFBRuILvtODfkN0PgRD6cZ0alJkyOMTEni4+\nLNq5PuxaNtowtq3HRBmsWPVbAoGBAM0tWmcONIg9RpZx8v14iQSTxJYJbs53joipF9AaCVM7\njYfTi6expTvBeSjykU9xOoayAZHhkXpBj/vihWS63HAh6CcljiBo0ChfVHxfHVVQ8jI8aL2l\nHY83K/AgGN0ZtTSwKuKMKqlHYWcz5rVK1Z68fohfDuyXenoJwsAQ0gTPAoGBAMHIkftZF53y\ntvdI16P7u3VUBO+oUmPPyRk0wUQzIJuGJ3LOw1MUctzPnuTS0t0zIg9fXTk0JhKRuiIeyW4g\nc3Vf1eapAtYa5ssnIbnz2PTlazwvUOf5bEgzIEJrDVtowd4nhuQt7fOEH0lC341olLAsq/ig\n663rcRz9vGVpasVvAoGAFvK1o8Ug9wPzeywvg04R9SMZ37YaYJlapcpT0YC3/kkw4To16oGh\n+3b+OCg5PGtrolkSd+CExunCUufZB5UmxpvkPUykAtf2QC25Y1e4DizJifjbtipbjgMbtPXC\nEiin7cauZTxMITbMnCBf83L1RZXLiTEomCmxFyk0UQsQkl0CgYEA6KrL6gpPysRFI6RFu3U1\nNTNxOVG7ysNY++QJE8eUmH60TaH9hmfwscv7mB5/c4Due4pgnCNhRBMSGizIDNupICrYHTP4\n2OPL2WlGZyxpMQ+pMZnLsDpMM7f87gfTo6cTvWeDS4vXm4zabtygwjBPxMzp1bkzV2wBd0/t\nuqrLPB8=\n-----END RSA PRIVATE KEY-----\n";
        //
        //     console.log(output.message);
        //
        //     signature.signSignature(output.message, privatekey).then((res) => {
        //         console.log("RES------"+ res);
        //         console.log("OUTPUT---" + output.signature);
        //         if(res.toString() === output.signature.toString()){
        //             console.log('hetzelfde')
        //         } else{
        //             console.log('niet hetzelfde');
        //         }
        //
        //     }).catch((err) => {
        //
        //     });
        // });
    });
});


server.listen(port, () => {
    console.log(`Chat server running fine on: ${port}`);
});

module.exports = routes;
