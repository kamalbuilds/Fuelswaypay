import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let dao = new Schema({
    owner: {
        type: String,
        required: true,
    },
    quorum: {
        type: Number,
        require: true
    },
    open: {
        type: Boolean,
        require: true
    },
    dao_type: {
        type: Number,
        require: true
    },
    members: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: false,
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,
    },
    twitter: {
        type: String,
        require: false,
    },
    github: {
        type: String,
        require: false,
    },
    discord: {
        type: String,
        require: false,
    },
    
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let DAO = mongoose.model('DAO', dao);
mongoose.models = {};
export default DAO;