import { mySQLDataSource } from "../app-data-source";
import { Skills } from "../Entity/skills";

exports.search = async(req, res) => {
    try{
        const skiller = await mySQLDataSource.getRepository(Skills).create(req.body)
        const result = await mySQLDataSource.getRepository(Skills).save(skiller)
        return res.send(result)
        
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }

}