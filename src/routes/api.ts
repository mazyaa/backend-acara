import express from 'express';
import * as authController from '../controllers/authContoller';
import authMiddleware from '../middlewares/authMiddleware';
import aclMiddleware from '../middlewares/acl.middleware';
import { ROLES } from '../utils/constant';

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/activation', authController.activation);
router.post('/auth/login', authController.login);
router.get('/auth/me',
    authMiddleware,
    authController.me
);

router.get('/test-acl', aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), (req, res) => {
    res.status(200).json({
        data: "success",
        message: "OK"
    });
})

export default router;