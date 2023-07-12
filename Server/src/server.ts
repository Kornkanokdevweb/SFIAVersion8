import express, {Request, Response, } from "express";
import dotenv from 'dotenv'
import{readdirSync} from 'fs'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

readdirSync('./src/Routes').map((r) => 
    app.use('/api', require('./Routes/'+r)))

app.listen(port, ()=>{
    console.log("hi")
})