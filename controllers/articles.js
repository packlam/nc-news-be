const { Article, Comment, User } = require('../models/index');
const { getCommentCount } = require('../utils/index');

const getArticles = (req, res, next) => {
  Article.find({}, '-__v')
  .populate('created_by', '-_id -__v')
  .lean()
  .then(articles => Promise.all(articles.map(article => getCommentCount(article, Comment))))
  .then(articles => res.status(200).send({ articles }))
  .catch(next)
};

const getArticleById = (req, res, next) => {
  Article.findById(req.params.article_id, '-__v')
  .populate('created_by', '-_id -__v')
  .lean()
  .then(article => {
    if (!article) {
      throw {msg: `article_id ${req.params.article_id} does not exist`, status: 404};
    } else return getCommentCount(article, Comment);
  })
  .then(article => res.status(200).send({ article }))
  .catch(next)
};

const updateArticleVoteCount = (req, res, next) => {
  voteAdjust = (req.query.vote === 'up') ? 1 : (req.query.vote === 'down') ? -1 : 0;
  if (voteAdjust) {
    Article.findByIdAndUpdate(req.params.article_id, {$inc : {'votes' : voteAdjust}}, {new: true})
    .then(article => {
      if (!article) throw {msg: `article_id ${req.params.article_id} does not exist`, status: 404};
      else res.status(200).send({ article })
    })
    .catch(next)
  } else next({msg: `${req.query.vote} is not a valid vote parameter`, status: 400})
};

const getCommentsByArticleId = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article_id })
  .populate('belongs_to', '-_id -__v')
  .populate('created_by', '-_id -__v')
  .then(comments => {
    if (comments.length === 0) {
      throw {msg: `article_id ${req.params.article_id} does not exist`, status: 404};
    } else res.status(200).send({ comments });
  })
  .catch(next)
};

const addComment = (req, res, next) => {
  return Promise.all([
    Article.findById(req.params.article_id),
    User.findById(req.body.created_by)
  ])
  .then(([article, user]) => {
    if (!article) {
      throw {msg: `article_id ${req.params.article_id} does not exist`, status: 404};
    } else if (!user) {
      throw {msg: `user_id ${req.body.created_by} does not exist`, status: 404};
    } else {
      req.body.belongs_to = req.params.article_id
      return Comment.create(req.body)
    }
  })
  .then(comment => res.status(201).send({ comment }))
  .catch(next)
};

module.exports = { getArticles, getArticleById, updateArticleVoteCount, getCommentsByArticleId, addComment }