// Validation
const { allowedEditFields } = require("../config/editableFields");

const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    // if(!firstName || !lastName) {
    //     throw new Error("Name is not valid!");
    // } else if((firstName.length < 2 || firstName.length > 30) || 
    //     (lastName.length < 2 || lastName.length > 30)){
    //     throw new Error("Name length should be in between 2 to 30")
    // }
}

const validateEditProfileData = (req) => {
    
    const isEditAllowed = Object.keys(req.body).every(
        field => allowedEditFields.includes(field)
    );

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}