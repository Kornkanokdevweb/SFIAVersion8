import { mySQLDataSource } from "../app-data-source"
import { Experience } from "../Entity/experience"

exports.create =async (req, res) => {
    try{
        const experienceted = await mySQLDataSource.getRepository(Experience).create(req.body)

        const result = await mySQLDataSource.getRepository(Experience).save(experienceted)
        
        return res.send(result)
    }catch(err){
        //error
        console.log(err)
        res.status(500).send('Server Error')
    }
}