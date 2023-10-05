import { Router } from "express";
const router = Router();
const { searchSkills, 
        dropdownSkillsAPI,
        createDatacollection,
        getDatacollection,
        updateDatacollection, 
        deleteDatacollection } = require('../controllers/skillsController')

const { getSkillName } = require('../controllers/portfolioController') 

// home page
router.get('/search', searchSkills);
router.get('/category', dropdownSkillsAPI);

// detailstandard page
router.post('/createDatacollection', createDatacollection);
router.get('/getDatacollection', getDatacollection);
router.put('/updateDatacollection', updateDatacollection);
router.delete('/deleteDatacollection', deleteDatacollection);

//portfolio
router.get('/getSkillName', getSkillName)
module.exports = router