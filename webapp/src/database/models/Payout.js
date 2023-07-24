import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let payout = new Schema({
    amount: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    }

}, {timestamps: true});

let Payout = mongoose.model('Payout', payout);
mongoose.models = {};
export default Payout;