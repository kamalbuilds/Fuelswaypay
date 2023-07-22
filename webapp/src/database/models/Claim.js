import { channel } from 'diagnostics_channel';
import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let claim = new Schema({
    nonce: {
        type: Number,
        require: true 
    },
    payer: {
        type: String,
        required: true,
    },
    payee: {
        type: String,
        required: false,
    },
    channel_address: {
        type: String,
        require: false 
    },
    status: {
        type: Number,
        require: true 
    },
    amount: {
        type: Number,
        require: true 
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Claim = mongoose.model('Claim', claim);
mongoose.models = {};
export default Claim;