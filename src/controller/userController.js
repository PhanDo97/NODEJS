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
module.exports = {
    handleLogin:handleLogin,
}