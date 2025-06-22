import express from 'express';
import * as testingController from '../controllers/testingController';
import * as authController from '../controllers/authContoller';


const router = express.Router();

router.get('/testingApi', testingController.getTestingApi);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

export default router;