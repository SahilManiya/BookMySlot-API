import express from 'express';
const routes = express.Router();
import { addMovie , AllMovie , updateMovie } from '../controllers/movieController.js';
import {isAuthenticatedUser,authorizeRoles} from '../middlewere/auth.js'; 

routes.post('/addMovie',isAuthenticatedUser,authorizeRoles('admin'),addMovie);

routes.get('/AllMovie',AllMovie);

routes.put('/updateMovie/:id',isAuthenticatedUser,authorizeRoles('admin'),updateMovie);

export default routes;
