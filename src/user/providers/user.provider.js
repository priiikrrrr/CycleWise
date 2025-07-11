const User = require("../user.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const bcrypt = require("bcrypt");
const getUserByEmail = require("../providers/getUserByEmail.js");

async function createUserProvider(req,res){
    const validatedData = matchedData(req);

    try{
        const existingUser = await getUserByEmail(validatedData.email);
        if(existingUser){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message : "A user with this email already exist!",
            });
        }
        const existingUsername = await User.findOne({ username: validatedData.username });  
        if (existingUsername) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is already taken" });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(validatedData.password,salt);

        const user = new User({
            ...validatedData,
            password : hashedPassword
        });
        await user.save();

        return res.status(StatusCodes.CREATED).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: validatedData.username,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            privacyMode: user.privacyMode,
        });
    }
    catch(error){
        errorLogger("error creating user", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unable to process request. Please try again later",
        });
    }
}

module.exports = createUserProvider;
