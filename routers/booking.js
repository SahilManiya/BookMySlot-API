import express from 'express';
const routes = express.Router();
import { bookMyTicket , getAllTicket , cancelTicket } from '../controllers/bookingController.js';
import {isAuthenticatedUser,authorizeRoles} from '../middlewere/auth.js'; 

routes.post('/bookMyTicket',isAuthenticatedUser,bookMyTicket);

routes.get('/getAllTicket',isAuthenticatedUser,authorizeRoles('admin'),getAllTicket);

routes.delete('/cancelTicket/:id',isAuthenticatedUser,cancelTicket);

export default routes;