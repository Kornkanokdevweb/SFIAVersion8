import { Router } from "express";
const { createEducation, getEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { createExperience, getExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const { getExportPortfolio } = require('../controllers/exportController')
const { requireAuth } = require('../middlewares/authMiddleware')

const router = Router();

//POST Methods */
router.post('/createEducation', requireAuth, createEducation)
router.post('/createExperience', requireAuth, createExperience)

//GET Methods /
router.get('/getEducation', requireAuth, getEducation)
router.get('/getExperience', requireAuth, getExperience)
router.get('/getExportPortfolio',requireAuth,getExportPortfolio)

//**PUT Methods
router.put('/updateEducation', requireAuth, updateEducation)
router.put('/updateExperience', requireAuth, updateExperience)

//*DELETE Methods/
router.delete('/deleteEducation', requireAuth, deleteEducation)
router.delete('/deleteExperience', requireAuth, deleteExperience)

module.exports = router