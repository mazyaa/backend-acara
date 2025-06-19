import express from 'express';
import router from './routes/api';

const app = express(); // assign instace of express to app
const PORT = process.env.PORT || 3000;

app.use(express.json()); // middleware to parse JSON bodies
app.use('/api', router);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});