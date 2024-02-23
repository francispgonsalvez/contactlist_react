import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './routers/userRouter.js';
const app = express();

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT||8000;
const URL = process.env.MONGOURL;

mongoose.connect(URL).then(()=>{
    console.log("mongo connected successfully");
    app.listen(PORT, ()=>{console.log(`http://localhost:${PORT}`)})

}).catch(error => console.log(error));

app.use("/api", router)