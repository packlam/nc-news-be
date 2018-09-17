exports.formatArticleData = (articleData, userRefs) => {
  return articleData.map(article => {
    return {
      title: article.title,
      body: article.body,
      votes: 0,
      belongs_to: article.topic,
      created_by: userRefs[article.created_by],
      created_at: article.created_at
    }
  })
};

exports.formatCommentData = (commentData, articleRefs, userRefs) => {
  return commentData.map(comment => {
    return {
      body: comment.body,
      votes: comment.votes,
      created_at: comment.created_at,
      belongs_to: articleRefs[comment.belongs_to],
      created_by: userRefs[comment.created_by]
    }
  })
};

exports.getCommentCount = (article, Comment) => {
  return Comment.countDocuments({ belongs_to: article._id })
    .then(commentCount => {
      article.comment_count = commentCount;
      return article;
    })
};