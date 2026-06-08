import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController();

router.post('/cadastro', userController.cadastro);
router.post('/login', userController.login);
router.get('/users', userController.users);

export default router;