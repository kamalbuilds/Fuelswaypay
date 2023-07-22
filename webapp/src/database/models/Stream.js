import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let stream = new Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    start_date: {
        type: Number,
        required: true
    },
    cancel_previlege: {
        type: Number,
        required: true
    },
    transfer_previlege: {
        type: Number,
        required: true
    },
    recipient: {
        type: String,
        required: true,
    },
    unlock_number: {
        type: Number,
        required: true
    },
    unlock_amount_each_time: {
        type: Number,
        required: true
    },
    unlock_every: {
        type: Number,
        required: true
    },
    prepaid: {
        type: Number,
        required: true
    },
    withdrew: {
        type: Number,
        required: false
    },
    status: {
        type: Number,
        required: true
    },
    total_fund: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Stream = mongoose.model('Stream', stream);
mongoose.models = {};
export default Stream;