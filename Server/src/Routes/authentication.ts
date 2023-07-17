import express, { Request, Response} from "express";

const router = express.Router()

//http://localhost:5000/api/register

router.post('/register', (req:Request, res:Response) => {
    res.send({ message: 'Hello register'})
})

router.post('/login', (req:Request, res:Response) => {
    res.send({ message: 'Hello login'})
})

module.exports = router