import { Router } from "express";
const { createEducation,getEducation,updateEducation,deleteEducation } = require('../controllers/educationController')

const router = Router();

//POST Methods */
router.post('/createEducation', createEducation)

//GET Methods /
router.get('/getEducation',getEducation)

//**PUT Methods
router.put('/updateEducation',updateEducation)

//*DELETE Methods/
router.delete('/deleteEducation',deleteEducation)

module.exports = router