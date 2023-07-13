import { createConnection } from "typeorm"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
    try{
        await createConnection({
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
        console.log('- Connected to MySQL Database enjoy!')
    }catch(err){
        console.log('Unable to connect to MySQL Database :(', err)
    }
}