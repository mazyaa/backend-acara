import express from 'express';
import * as testingController from '../controllers/testingController';
import * as authController from '../controllers/authContoller';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/testingApi', testingController.getTestingApi);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me',
    authMiddleware,
    authController.me
)

export default router;