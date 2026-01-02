const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required:true
        },
        emailId: {
            type: String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            validate(value) {
                if(!validator.isEmail(value))
                    throw new Error("Enter Valid EmailId");
            }
        },
        password: {
            type: String,
            required:true,
            validate(value) {
                if(!validator.isStrongPassword(value))
                    throw new Error("Strong password required!");
            }
        },
        age: {
            type: Number,
            min:18
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female'],
                message: 'Gender must be either male or female'
            }
        },
        photoUrl: {
            type: String,
            default:''
        },
        about: {
            type: String,
            default: 'Tech Enthusiast',
            maxLength: 50
        },
        skills: {
            type: [String],
            maxLength:20
        }
    },
    {
        timestamps:true
    },
    {
        strict:true
    }
);

userSchema.index({ firstName:1, lastName:1 }); 

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "J)w8h$AG", {
        expiresIn: "1d",
    });

    return token;
}

userSchema.methods.validatePassword = async function (userPass) {
    const user = this;
    const isPasswdValid = await bcrypt.compare(userPass,user.password);
    return isPasswdValid;
}

module.exports = mongoose.model("User",userSchema);