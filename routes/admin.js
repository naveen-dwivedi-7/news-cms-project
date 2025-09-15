const  express=require('express')
const router=express.Router();


//Login Routes

router.get('/',loginPage);
router.get('/index',adminLogin);
router.get('/logout',logout);

//User CRUD Routes

router.get('/user',allUser);
router.get('/add-user',allUserPage);
router.post('/add-user',allUser);
router.get('/update-user/:id',updateUserPage);
router.post('/update-user/:id',updateUser);
router.get('/delete-user/:id',deleteUser);

//Category CRUD Routes

router.get('/category',allUser);
router.get('/category-user',allCategoryPage);
router.post('/add-category',allCategory);
router.get('/update-category/:id',updateCategoryPage);
router.post('/update-category/:id',updateCategory);
router.get('/delete-category/:id',deleteCategory);

//Article CRUD Routes

router.get('/article',allArticle);
router.get('/article-user',allArticlePage);
router.post('/add-article',allArticle);
router.get('/update-article/:id',updateArticlePage);
router.post('/update-article/:id',updateArticle);
router.get('/delete-article/:id',deleteArticle);

//Comment Route

router.get('/comments',allComments);


module.exports=router;

