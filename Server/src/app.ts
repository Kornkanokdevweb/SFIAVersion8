import express from "express";
import { myDataSource } from "./configs/connectDatabase";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { readdirSync } from "fs";
import cookieParser from "cookie-parser";

dotenv.config()

myDataSource
  .initialize()
  .then(() => {
    console.log("- Data Source has been intitialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

const app: express.Application = express();

const port = process.env.PORT || 8081;

//middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:4200','http://localhost:8000'],
  credentials: true
}))
app.use(morgan('dev'))

//routes
readdirSync('./src/routes').map((r) => app.use('/api', require('./routes/'+r)))

//listening server overhere
app.listen(port, () => {
  console.log(`- TypeScript with Express http://localhost:${port}/`);
});