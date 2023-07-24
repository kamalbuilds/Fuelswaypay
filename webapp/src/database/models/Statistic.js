import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let statistic = new Schema({
    dao: {
        type: Number,
        require: true
    },
    fund: {
        type: Number,
        require: true
    },
    proposal: {
        type: Number,
        require: true
    },
    executedProposal: {
        type: Number,
        require: true
    },
    members: {
        type: Number,
        require: true
    },
    stream: {
        type: Number,
        require: true
    },
    channel: {
        type: Number,
        require: true
    },
    claim: {
        type: Number,
        require: true
    }

}, {timestamps: true});

let Statistic = mongoose.model('Statistic', statistic);
mongoose.models = {};
export default Statistic;