const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    username: String,
    password: String,
    friends: []
}, {timestamps: true});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;