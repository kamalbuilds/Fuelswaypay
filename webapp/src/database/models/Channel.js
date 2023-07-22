import { channel } from 'diagnostics_channel';
import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let channel = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    payer: {
        type: String,
        required: true,
    },
    payee: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        require: false 
    },
    status: {
        type: Number,
        require: true 
    },
    total_fund: {
        type: Number,
        require: false 
    },
    nonce: {
        type: Number,
        require: true 
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Channel = mongoose.model('Channel', channel);
mongoose.models = {};
export default Channel;