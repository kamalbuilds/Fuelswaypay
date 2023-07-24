import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let proposal = new Schema({
    id: {
        type: Number,
        require: false 
    },
    owner: {
        type: String,
        required: true,
    },
    dao_address: {
        type: String,
        required: false,
    },
    proposal_type: {
        type: Number,
        require: true 
    },
    status: {
        type: Number,
        require: true 
    },
    recipient: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    start_date: {
        type: Number,
        required: true,
    },
    end_date: {
        type: Number,
        required: true,
    },
    allow_early_execution: {
        type: Boolean,
        required: true
    },
    agree: {
        type: Number,
        required: false
    },
    disagree: {
        type: Number,
        required: false
    },
    executed: {
        type: Number,
        required: false
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    content_type: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let Proposal = mongoose.model('Proposal', proposal);
mongoose.models = {};
export default Proposal;