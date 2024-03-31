import express from 'express';
const routes = express.Router();
import {createShow , findShow } from '../controllers/showController.js';
import {isAuthenticatedUser,authorizeRoles} from '../middlewere/auth.js'; 

routes.post('/createShow/:id',isAuthenticatedUser,authorizeRoles('admin'),createShow);

routes.get('/findShow',findShow);

export default routes;