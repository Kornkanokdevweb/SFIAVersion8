import { Router } from "express";
const { getHistory } = require('../controllers/historyController')
const { requireAuth } = require('../middlewares/authMiddleware')

const router = Router();

router.get('/getHistory', requireAuth, getHistory);

module.exports = router