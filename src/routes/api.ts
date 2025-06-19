import express from 'express';
import * as testingController from '../controllers/testingController';


const router = express.Router();

router.get('/testingApi', testingController.getTestingApi);

export default router;