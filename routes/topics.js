const topicsRouter = require('express').Router();
const { getTopics, getArticlesByTopicSlug, addArticleToTopic } = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics)

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesByTopicSlug)
  .post(addArticleToTopic)

module.exports = topicsRouter;