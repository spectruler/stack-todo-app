const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const passportLocalMongoose = require('passport-local-mongoose')

// create User schema, mongoose model and export module to use in other files
const UserSchema = new Schema({

})

UserSchema.plugin(passportLocalMongoose) // it adds username & password attributes for us

Users = mongoose.model('User',UserSchema)
module.exports = Users 