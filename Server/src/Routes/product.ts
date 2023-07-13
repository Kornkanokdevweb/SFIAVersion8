import express, { Request, Response } from 'express'

const router = express.Router()
const { list } = require('../Controller/product')

router.get('/product', list)

module.exports = router