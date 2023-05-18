import db from '../models/index';
import CRUDService from '../services/CRUDService';
let getHomePage = async(req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
    
};
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
};
let getCrudPage = (req, res) => {
    return res.render('test/crud.ejs');
};
let postCrud = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');
};
let getCrud = async(req, res) => {
    let data = await CRUDService.getAllUsers();
    console.log('-------------------------')
    console.log(data);
    console.log('-------------------------')
    return res.render('test/displayCRUD.ejs', {
        dataTable: data
    });
};
let editCrud = async(req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // check user data not found
        return res.render('test/editCRUD.ejs', {
            data: userData
        })
    }else {
        return res.send('Users not found')
    }
}
let putCrud = async(req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data)
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('test/displayCRUD.ejs', {
        dataTable: allUsers
    });

};
let deleteCrud = async(req, res) => {
    let id = req.query.id;
    if(id){
        await CRUDService.deleteUserById(id);
        return res.send('Delete the user success!')
    }else {
        return res.send('User not found');
    }
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCrudPage: getCrudPage,
    postCrud: postCrud,
    getCrud: getCrud,
    editCrud: editCrud,
    putCrud: putCrud,
    deleteCrud: deleteCrud
}