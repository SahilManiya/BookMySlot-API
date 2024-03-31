import express from 'express';
const routes = express.Router();
import { register , login , logout , userProfile , getUser , userUpdate  } from '../controllers/userController.js';
import {isAuthenticatedUser,authorizeRoles} from '../middlewere/auth.js'; 

routes.post('/register',register);

routes.post('/login',login);

routes.get('/logout',logout);

routes.get('/userProfile',isAuthenticatedUser,userProfile);

routes.get('/getUser',isAuthenticatedUser,authorizeRoles('admin'),getUser);

routes.put('/userUpdate/:id',isAuthenticatedUser,userUpdate);

export default routes;