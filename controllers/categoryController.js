const categoryModel = require('../models/Category');


const allCategory = async (req,res) => { 
 res.render('admin/categories')
}
const addCategoryPage = async (req,res) => {
  res.render('admin/categories/create')
 }

const addCategory = async (req,res) => { 
  
}

const updateCategoryPage = async (req,res,next) => { 
  res.render('admin/categories/update')
}

const updateCategory = async (req,res,next) => {
  
 }

const deleteCategory = async (req,res,next) => {
 
 }

module.exports = {
  allCategory,
  addCategoryPage,
  addCategory,
  updateCategoryPage,
  updateCategory,
  deleteCategory
}