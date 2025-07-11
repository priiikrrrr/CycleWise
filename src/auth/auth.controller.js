const{StatusCodes} = require("http-status-codes");
const authProvider = require("./providers/auth.provider.js");


async function authController(req,res){
    return await authProvider(req,res);
}

module.exports = {authController};