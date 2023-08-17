import { Router } from "express";
const { searchSkills, listSkill, addDescriptionToSkill } = require('../controllers/searchController')

const router = Router();

router.get('/search', searchSkills);
router.get('/search/:codeskill', listSkill);


module.exports = router