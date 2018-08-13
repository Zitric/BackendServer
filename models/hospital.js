const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: { type: String, required: [ true, 'the name is mandatory' ] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: true }

});

module.exports = mongoose.model( 'Hospital', hospitalSchema );