import express from 'express';
import homeController from '../controller/homeController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.send('hello');
    })
    router.get('/hoidanit', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    return app.use('/', router);
}

module.exports = initWebRoutes;