const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );
const Schema = mongoose.Schema;

const allowedRoles = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} is a role not allowed'
};

const userSchema = new Schema({

    name: { type: String, required: [ true, 'the name is mandatory' ]},
    email: { type: String, unique: true, required: [ true, 'the email is mandatory' ]},
    password: { type: String, required: [ true, 'the password is mandatory' ]},
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: allowedRoles },
    status: { type: Boolean, default: true }

});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

// {PATH} without spaces
userSchema.plugin( uniqueValidator, { message: 'the {PATH} must be unique' });

module.exports = mongoose.model( 'User', userSchema );