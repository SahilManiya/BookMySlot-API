import express from 'express';
const routes = express.Router();
import { createTheater , AvailableTheater , updateTheater } from '../controllers/theaterController.js';
import {isAuthenticatedUser,authorizeRoles} from '../middlewere/auth.js'; 

routes.post('/createTheater',isAuthenticatedUser,authorizeRoles('admin'),createTheater);

routes.get('/AvailableTheater',AvailableTheater);

routes.put('/updateTheater/:id',isAuthenticatedUser,authorizeRoles('admin'),updateTheater);

export default routes;