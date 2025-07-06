import express from 'express';
import * as authController from '../controllers/authContoller';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('auth/activation', authController.activation);
router.get('/auth/me',
    authMiddleware,
    authController.me
);

export default router;