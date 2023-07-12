import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/product',(req:Request, res:Response) => {
    res.json('product').status(200)
})

module.exports =router