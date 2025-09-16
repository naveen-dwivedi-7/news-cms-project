const commentModel = require('../models/Comment');


const allComments = async (req,res,next) => { 
 res.render('admin/comments')
 
}


const updateCommentStatus = async (req,res,next) => { 
 
}

const deleteComment = async (req,res,next) => { 
 
}

module.exports = {
  allComments,
  updateCommentStatus,
  deleteComment
}