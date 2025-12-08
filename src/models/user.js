const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = mongoose.model("User",userSchema);