import express, { Request, Response} from "express";

const router = express.Router()
const {search} = require('../Controller/skills')

router.post('/skills', search)

module.exports = router