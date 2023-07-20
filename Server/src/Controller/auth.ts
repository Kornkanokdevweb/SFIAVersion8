import { Register } from "../Entity/user";

exports.register =async (req, res) => {
    try{
        
    }catch(err){
        //error
        console.log(err)
        res.status(500).send('Server Error')
    }
}