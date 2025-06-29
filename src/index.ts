import express from 'express';
import router from './routes/api';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { connectToDatabase} from './utils/database';
import docs from './docs/routes';
import cors from 'cors';


async function init () {
    try {
        const result = await connectToDatabase();
        
        console.log(result);

        const app = express(); // assign instace of express to app
        const PORT = process.env.PORT;
        
        app.use(cors()); // enable CORS for all routes
        app.use(express.json()); // middleware to parse JSON bodies

        // default route
        app.get('/', (req, res) => {
            res.status(200).json({
                message: 'Welcome to the API Event Management System!',
                data: null
            })
        });
        app.use('/api', router);

        //docs routes
        docs(app);
        app.use(bodyParser.json()); // middleware to parse JSON bodies with body-parser
        
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`Failed to initialize the application: ${error}`);
    }
}

init();

