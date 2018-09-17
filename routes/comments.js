const commentsRouter = require('express').Router();
const { updateCommentVoteCount, deleteComment } = require('../controllers/comments');

commentsRouter.route('/:comment_id')
  .patch(updateCommentVoteCount)
  .delete(deleteComment)

module.exports = commentsRouter;