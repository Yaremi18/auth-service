import express from 'express';
import { getUsers } from '../controllers/privateController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/users', getUsers);

export default router;
