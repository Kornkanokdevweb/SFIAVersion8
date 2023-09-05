import { Router } from "express";
const { searchSkills, listSkill, dropdownCategories, dropdownSubcategories } = require('../controllers/searchController')

const router = Router();

router.get('/search', searchSkills);
router.get('/search/:codeskill', listSkill);
router.get('/category', dropdownCategories);//ค้นหาข้อมูลCategoryทั้งหมด
router.get('/category/:category_text', dropdownSubcategories);//ค้นหาCategoryแบบเฉพาะเจาะจง


module.exports = router