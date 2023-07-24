import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let addressGroup = new Schema({
    owner: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let AddressGroup = mongoose.model('AddressGroup', addressGroup);
mongoose.models = {};
export default AddressGroup;