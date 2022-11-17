const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routeURLs = require('./Routes/routeURLs.js')


const app = express();
const PORT = 4451;
dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/api',routeURLs);
app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
});
