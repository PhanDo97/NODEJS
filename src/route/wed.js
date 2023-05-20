import express from 'express';
import homeController from '../controller/homeController';
import userController from '../controller/userController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.send('hello');
    })
    router.get('/hoidanit', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCrudPage);

    router.post('/post-crud', homeController.postCrud);
    router.get('/get-crud', homeController.getCrud);
    router.get('/edit-crud', homeController.editCrud);
    router.post('/put-crud', homeController.putCrud);
    router.get('/delete-crud', homeController.deleteCrud);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    return app.use('/', router);
}

module.exports = initWebRoutes;