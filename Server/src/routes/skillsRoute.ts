import { Router } from "express";
const router = Router();
const { searchSkills, listSkill, 
        dropdownSkillsAPI } = require('../controllers/searchController')

router.get('/search', searchSkills);
router.get('/category', dropdownSkillsAPI);


module.exports = router