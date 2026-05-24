import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController();

router.get('/users', userController.index);
router.post('/users', userController.store);

export default router;