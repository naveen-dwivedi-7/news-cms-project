const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');


const allArticle = async (req,res,next) => {
 try {
    let articles;
    if(req.role === 'admin'){ 
     articles = await newsModel.find()
                                .populate('category','name')
                                .populate('author','fullname');
    }else{
      articles = await newsModel.find({ author: req.id })
                                .populate('category','name')
                                .populate('author','fullname');
    }                            
    res.render('admin/articles', { role: req.role, articles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
    // next(error)
  }}

const addArticlePage = async (req,res) => {
  const categories = await categoryModel.find();
  res.render('admin/articles/create', { role: req.role, categories, errors: 0 });

}

const addArticle = async (req,res,next) => { 
   try {
    const { title, content, category } = req.body;
    const article = new newsModel({
      title,
      content,
      category,
      author: req.id,
      image: req.file.filename
    });
    await article.save();
    res.redirect('/admin/article');
  } catch (error) {
    console.log(error);
    res.status(500).send('Article not saved');
    //next(error)
  }
}

const updateArticlePage = async (req,res,next) => {
  res.render('admin/articles/update',{role: req.role})

}

const updateArticle = async (req,res,next) => {
  
 }

const deleteArticle = async (req,res,next) => { 
  
}

module.exports = {
  allArticle,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle
}
