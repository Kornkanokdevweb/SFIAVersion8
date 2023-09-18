import { Router } from "express";
const { createEducation, getEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { createLink, getLink, updateLink, deleteLink } = require('../controllers/linkController');
const { createExperience, getExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');

const router = Router();

//POST Methods */
router.post('/createEducation', createEducation)
router.post('/createLink', createLink)
router.post('/createExperience', createExperience)

//GET Methods /
router.get('/getEducation', getEducation)
router.get('/getLink', getLink)
router.get('/getExperience', getExperience)

//**PUT Methods
router.put('/updateEducation', updateEducation)
router.put('/updateLink', updateLink)
router.put('/updateExperience', updateExperience)

//*DELETE Methods/
router.delete('/deleteEducation', deleteEducation)
router.delete('/deleteLink', deleteLink)
router.delete('/deleteExperience', deleteExperience)

module.exports = router