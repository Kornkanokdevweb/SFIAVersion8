import { Router } from "express";
const router = Router();
const { searchSkills, 
        dropdownSkillsAPI,
        createDatacollection } = require('../controllers/skillsController')

router.get('/search', searchSkills);
router.get('/category', dropdownSkillsAPI);
router.post('/createDatacollection', createDatacollection);

module.exports = router