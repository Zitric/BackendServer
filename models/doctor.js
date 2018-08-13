const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: { type: String, required: [ true, 'the name is mandatory' ] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'the id of hospital is mandatory'] } });


module.exports = mongoose.model('Doctor', doctorSchema);

