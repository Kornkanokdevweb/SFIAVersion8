import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { readdirSync } from "fs";

import { connectDB } from "./mySQL";

dotenv.config()

connectDB()

const app = express()
const port = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))

readdirSync('./src/Routes').map((r) => 
    app.use('/api', require('./Routes/'+r)))

app.listen(port, ()=>{
    console.log(`- Server is running on http://localhost:${port} enjoy! `)
})