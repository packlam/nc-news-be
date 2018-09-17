const articlesRouter = require('express').Router();
const { getArticles, getArticleById, updateArticleVoteCount, getCommentsByArticleId, addComment } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles)

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleVoteCount)

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(addComment)

module.exports = articlesRouter;