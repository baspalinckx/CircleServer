const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
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
    },
    password:{
        type: String,
        required: true
    },
    transparent:{
        type: Boolean,
        required: true
    },
    satoshi:{
        type: Number,
        required: false
    },
    publickey:{
        type: String,
        required: true
    },
    userHistory:{
        type: Schema.Types.ObjectId,
        ref: 'userhistory'
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;