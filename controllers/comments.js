const Comment = require('../models/Comment');

const updateCommentVoteCount = (req, res, next) => {
  voteAdjust = (req.query.vote === 'up') ? 1 : (req.query.vote === 'down') ? -1 : 0;
  if (voteAdjust) {
    Comment.findByIdAndUpdate(req.params.comment_id, {$inc : {'votes' : voteAdjust}}, {new: true})
    .then(comment => {
      if (!comment) {
        throw {msg: `comment_id ${req.params.comment_id} does not exist`, status: 404};
      } else res.status(200).send({ comment })
    })
    .catch(next)
  } else next({msg: `${req.query.vote} is not a valid vote parameter`, status: 400})
};

const deleteComment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.comment_id)
  .then(deleted => {
    if (!deleted) {
      throw {msg: `comment_id ${req.params.comment_id} does not exist`, status: 404};
    } else res.status(200).send({ deleted })
  })
  .catch(next)
};

module.exports = { updateCommentVoteCount, deleteComment };