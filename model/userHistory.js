const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userHistorySchema = new Schema({
    streamHistory:[{
        startTime:{
            type: Date,
            required: true
        },
        endTime:{
            type: Date,
            required: false
        },
        streamId:{
            type: String,
            required: true
        }
    }],
    chatHistory:[{
        date:{
            type: Date,
            required: true
        },
        message:{
            type: String,
            required: true
        },
        room:{
            type: String,
            required: true
        }
    }],
    viewHistory:[{
        startTime:{
            type: Date,
            required: true
        },
        endTime:{
            type: Date,
            required: false
        },
        streamId:{
            type: String,
            required: false
        }
    }]
});

const userHistory = mongoose.model('userhistory', userHistorySchema);

module.exports= userHistory;