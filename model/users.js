const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: Schema,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    }
    password:{
        type: String,
        required: true
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;