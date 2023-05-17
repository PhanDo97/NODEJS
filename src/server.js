import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/wed';
import connectDB from './config/connectDB';

require('dotenv').config();

const app = express();

const port = process.env.PORT || 6969;
// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

viewEngine(app);
initWebRoutes(app);
connectDB();

app.listen(port,() => {
    console.log('Backend node.js is running on port '+ port);
})