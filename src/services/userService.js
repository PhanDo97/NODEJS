import db from "../models/index";
import bcrypt from 'bcryptjs';


let handleUserLogin = (email, password) => {
    return new Promise( async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exists
                let user = await db.User.findOne({ 
                    raw: true, 
                    where: { email: email },
                    attributes:  ['email','roleId','password'], 
                });
                if (user) {
                // compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errorCode = 0,
                        userData.errorMessage = 'ok';
                        // bỏ password ở obj in ra
                        delete user.password;
                        userData.user = user;
                    }else {
                        userData.errorCode = 3,
                        userData.errorMessage = 'wrong password';
                    }
                }else {
                    userData.errorCode = 2;
                    userData.errorMessage = `User's not found`
                }
            }else {
                // return error
                userData.errorCode = 1;
                userData.errorMessage = `Your's email isn't exist in your system. Please try other email!`
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
};
let checkUserEmail =(email) => {
    return new Promise( async(resolve, reject) => {
        try {
            let user = await db.User.findOne({ 
                where: { email: email },
            });
            if (user) {
                resolve(true)
            }else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        }
    })
};


module.exports = {
    handleUserLogin: handleUserLogin,
};