import db from "../models/index";
import userService from "../services/userService"

let handleLogin = async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // check email exists
    if (!email || !password) {
        return res.status(500).json({
            errorCode: 1,
            message: 'Missing input parameters!'
        })
    }
    let userData = await userService.handleUserLogin(email, password)
    // compare password
    // return userInfo
    // access token: JWT token
    return res.status(200).json({
        errorCode: userData.errorCode,
        message: userData.errorMessage,
        user: userData.user ? userData.user: {}
    });
};
let handleGetAllUsers = async(req,res) => {
    let id = req.body.id; // all, id
    if(!id) {
        return res.status(200).json({
            errorCode: 1,
            errorCodeMessage: 'Missing required parameter',
            user: []
        })
    }
    let user = await userService.getAllUser(id)
    console.log(user);
    return res.status(200).json({
        errorCode: 0,
        errorCodeMessage: 'OK',
        user
    })
};

module.exports = {
    handleLogin:handleLogin,
    handleGetAllUsers: handleGetAllUsers
}
