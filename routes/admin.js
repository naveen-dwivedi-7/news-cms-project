const  express=require('express')
const router=express.Router();



const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const UserController = require('../controllers/userController');
//Login Routes

router.get('/',UserController.loginPage);
router.get('/index',UserController.adminLogin);
router.get('/logout',UserController.logout);
router.get('/dashboard',UserController.dashboard);
router.get('/settings',UserController.settings);



//User CRUD Routes

router.get('/users',UserController.allUser);
router.get('/add-user',UserController.addUserPage);
router.post('/add-user',UserController.addUser);
router.get('/update-user/:id',UserController.updateUserPage);
router.post('/update-user/:id',UserController.updateUser);
router.get('/delete-user/:id',UserController.deleteUser);

//Category CRUD Routes

// router.get('/category',categoryController.allCategory);
// router.get('/category-user',categoryController.addCategoryPage);
// router.post('/add-category',categoryController.addCategory);
// router.get('/update-category/:id',categoryController.updateCategoryPage);
// router.post('/update-category/:id',categoryController.updateCategory);
// router.get('/delete-category/:id',categoryController.deleteCategory);

router.get('/category',  categoryController.allCategory);
router.get('/add-category',categoryController.addCategoryPage);
router.post('/add-category',  categoryController.addCategory);
router.get('/update-category/:id', categoryController.updateCategoryPage);
router.post('/update-category/:id',  categoryController.updateCategory);
router.delete('/delete-category/:id',  categoryController.deleteCategory);

//Article CRUD Routes

router.get('/article',articleController.allArticle);
router.get('/add-article',articleController.addArticlePage);
router.post('/add-article',articleController.allArticle);
router.get('/update-article/:id',articleController.updateArticlePage);
router.post('/update-article/:id',articleController.updateArticle);
router.get('/delete-article/:id',articleController.deleteArticle);

//Comment Route

router.get('/comments',commentController.allComments);


module.exports=router;

