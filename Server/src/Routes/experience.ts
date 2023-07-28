import express, { Request, Response} from "express";

const router = express.Router()

const {create} = require('../Controller/experience')

router.post('/experience',create)


module.exports = router