var mongoose = require( 'mongoose' );
var uniqueValidator = require( 'mongoose-unique-validator' );
var Schema = mongoose.Schema;

var allowedRoles = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} is a role not allowed'
};

var userSchema = new Schema({

    name: { type: String, required: [ true, 'the name is mandatory' ]},
    email: { type: String, unique: true, required: [ true, 'the email is mandatory' ]},
    password: { type: String, required: [ true, 'the password is mandatory' ]},
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: allowedRoles }

});

// {PATH} without spaces
userSchema.plugin( uniqueValidator, { message: 'the {PATH} must be unique' });

module.exports = mongoose.model( 'User', userSchema );