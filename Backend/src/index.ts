import express, {Express} from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT: number | string = process.env.PORT || 4000;
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    console.log('have new request! ');
    res.send('Hello World!😒');
}); 

import usersRouter from './users/router';

app.use('/users', usersRouter);

app.listen(PORT, () => console.log(`⚡Server running on port ${PORT} 💫`));
