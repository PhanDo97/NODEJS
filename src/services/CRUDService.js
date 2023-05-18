import db from '../models/index';
import bcrypt from 'bcryptjs';
var salt = bcrypt.genSaltSync(10);

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
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
            resolve('Create a new user success!!!');
        } catch (error) {
            reject(error);
        }
    });
};

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
let getAllUsers = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
};
let getUserInfoById = (userId) => {
    return new Promise( async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                raw: true,
                where: {id: userId}
            })
            if (user) {
                resolve(user)
            }else {
                resolve([])
            }
        } catch (error) {
            reject(error);
        }
    })
};
let updateUserData = (data) => {
    return new Promise( async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let allUsers = db.User.findAll({
                    raw: true,
                });
                resolve(allUsers);
            }else {
                resolve();
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
};
let deleteUserById = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            })
            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    })
};

module.exports = {
    createNewUser: createNewUser,
    getAllUsers: getAllUsers,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
};