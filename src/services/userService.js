import db from "../models/index";
import bcrypt from 'bcryptjs';
var salt = bcrypt.genSaltSync(10);


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
let getAllUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let user = '';
        try {
            if (userId === 'ALL') {
                user = await db.User.findAll({
                    // raw: true,
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            if (userId && userId !=='ALL'){
                user = await db.User.findOne({
                    // raw: true,
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(user);
        } catch (error) {
            reject(error);
        }
    })
}
let createNewUser = (data) => {
    return new Promise( async(resolve, reject) => {
        try {
            // check email is exist ?
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail) {
                resolve({
                    errorCode: 1,
                    message: 'your email is already in use, please try again',
                });
            }else{

                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1'? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errorCode: 0,
                    message: 'OK',
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}
let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
            try {
                var hashPassword = await bcrypt.hashSync(password, salt);
                resolve(hashPassword);
            } catch (error) {
                reject(error);
            }
    })
};
let updateUserData = (data) => {
    return new Promise( async(resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    message: 'Missing required'
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            })
            if(user) {
                user.firstName = data.firstName,
                user.lastName = data.lastName,
                user.address = data.address,
                await user.save();
                resolve({
                    errorCode: 0,
                    message: 'the user update success'
                })
            }else {
                resolve({
                    errorCode: 1,
                    message: 'user not found'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
};
let deleteUser = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {id: id}
            })
            if (!user) {
                resolve({
                    errorCode: 2,
                    message: 'User not found'
                })
            }
            if(user){
                await db.User.destroy({
                    where: {id: id}
                });
                resolve({
                    errorCode: 0,
                    message: 'User deleted'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser:getAllUser,
    createNewUser: createNewUser,
    updateUserData: updateUserData,
    deleteUser: deleteUser
};

