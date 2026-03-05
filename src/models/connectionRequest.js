const mongoose = require('mongoose');

const User = require('./user')
const ConnectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref :User
        },
        toUserId :{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref: User
        },
        status :{
            type:String,
            required:true,
            enum :{
                values :['accepted','rejected','ignored','interested'],
                message:'{VALUE} is incorrect status type'
            }
        }
    },
    {timestamps:true}
);

const ConnectionRequest = mongoose.model('ConnectionRequest', ConnectionRequestSchema)

module.exports = ConnectionRequest;