import express from 'express';
import router from './routes/api';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { connectToDatabase} from './utils/database';


async function init () {
    try {
        const result = await connectToDatabase();
        
        console.log(result);

        const app = express(); // assign instace of express to app
        const PORT = process.env.PORT;
        
        app.use(express.json()); // middleware to parse JSON bodies
        app.use('/api', router);
        app.use(bodyParser.json()); // middleware to parse JSON bodies with body-parser
        
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`Failed to initialize the application: ${error}`);
    }
}

init();

