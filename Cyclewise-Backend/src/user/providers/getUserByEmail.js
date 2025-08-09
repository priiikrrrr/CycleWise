const User = require("../user.schema.js");

async function getUserByEmail(email){
    try {
        return await User.findOne({email});
    } catch (error) {return error}
};

module.exports = getUserByEmail;