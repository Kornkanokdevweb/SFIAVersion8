import { Router } from "express";
const router = Router();
const { searchSkills, 
        dropdownSkillsAPI,
        createDatacollection,
        getDatacollection,
        updateDatacollection, 
        deleteDatacollection } = require('../controllers/skillsController')

// home page
router.get('/search', searchSkills);
router.get('/category', dropdownSkillsAPI);

// detailstandard page
router.post('/createDatacollection', createDatacollection);
router.get('/getDatacollection', getDatacollection);
router.put('/updateDatacollection', updateDatacollection);
router.delete('/deleteDatacollection', deleteDatacollection);

module.exports = router