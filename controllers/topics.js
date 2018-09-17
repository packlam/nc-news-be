const { Article, Comment, Topic, User } = require('../models/index');
const { getCommentCount } = require('../utils/index');

const getTopics = (req, res, next) => {
  Topic.find({}, '-_id -__v')
  .then(topics => res.status(200).send({ topics }))
  .catch(next)
};

const getArticlesByTopicSlug = (req, res, next) => {
  Article.find({belongs_to: req.params.topic_slug}, '-_id, -__v')
  .populate('created_by', '-__v')
  .lean()
  .then(articles => {
    if (articles.length === 0) {
      throw {msg: `topic slug ${req.params.topic_slug} does not exist`, status: 404}
    } else return Promise.all(articles.map(article => getCommentCount(article, Comment)))
  })
  .then(articles => res.status(200).send({ articles }))
  .catch(next)
}

const addArticleToTopic = (req, res, next) => {
  return Promise.all([
    Topic.findOne({slug: req.params.topic_slug}),
    User.findById(req.body.created_by)
  ])
  .then(([topic, user]) => {
    if (!topic) {
      throw {msg: `topic slug ${req.params.topic_slug} does not exist`, status: 404}
    } else if (!user) {
      throw {msg: `username ${req.body.created_by} does not exist`, status: 404}
    } else {
      req.body.belongs_to = req.params.topic_slug
      return Article.create(req.body)
    }
  })
  .then(article => res.status(201).send({ article }))
  .catch(next)
}

module.exports = { getTopics, getArticlesByTopicSlug, addArticleToTopic };