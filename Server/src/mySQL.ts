import { DataSource } from "typeorm"
import "reflect-metadata"

import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
    try{
        await new DataSource({
            type: "mysql",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: ["src/Entity/*.ts"],
            // logging: true,
            synchronize: true,
        })
        .initialize()
        .then(() => {
            console.log('- Connected to mySQL Database :)')
        })
    }catch(error){
        console.log('Error during Data Source initialization:', error)
    }
}