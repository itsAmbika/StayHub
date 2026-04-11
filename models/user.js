const mongoose = require("mongoose");
const passportLocalMongoosePkg = require("passport-local-mongoose");
const passportLocalMongoose = passportLocalMongoosePkg.default || passportLocalMongoosePkg;

const { Schema } = mongoose;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }


});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);