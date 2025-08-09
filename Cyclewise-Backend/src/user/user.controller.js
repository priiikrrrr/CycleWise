const {StatusCodes} = require("http-status-codes");
const createUserProvider = require("./providers/user.provider.js");
const updateUserProvider = require("./providers/updateUser.provider.js");
const getUserProvider = require("./providers/getUser.provider.js")


// async function createUser(req, res) {//extra - remove later
//   console.log("REQ.BODY", req.body); //extra - remove later
//   return await createUserProvider(req, res);//extra - remove later
// }//extra - remove later


async function createUser(req,res){
    return await createUserProvider(req,res);
}

async function updateUser(req,res){
    return await updateUserProvider(req,res);
}

async function getUser(req,res){
    return await getUserProvider(req,res);
}
module.exports = {createUser,updateUser,getUser};
