import { Router } from "express";
const router = Router();
const { searchSkills, listSkill, 
        dropdownSkillsAPI } = require('../controllers/skillsController')

router.get('/search', searchSkills);
router.get('/category', dropdownSkillsAPI);


module.exports = router