const jwt = require("jsonwebtoken");

function generateTokenProvider(user){
    const payLoad = {
        sub : user["_id"],
        email : user.email,
        iat : Math.floor((Date.now())/1000),
        exp : Math.floor((Date.now())/1000)+ parseInt(process.env.JWT_ACCESS_EXPIRATION_TTL),
    };

    return jwt.sign(payLoad, process.env.JWT_SECRET);
}

module.exports = generateTokenProvider;