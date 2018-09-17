const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models/index');
const { formatArticleData, formatCommentData } = require('../utils/index');

const seedDB = (articleData, commentData, topicData, userData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      const userRefs = userDocs.reduce((acc, user) => {
        acc[user.username] = user._id;
        return acc;
      }, {})

      return Promise.all([
        Article.insertMany(formatArticleData(articleData, userRefs)),
        topicDocs,
        userDocs,
        userRefs
      ])
    })
    .then(([articleDocs, topicDocs, userDocs, userRefs]) => {
      const articleRefs = articleDocs.reduce((acc, article) => {
        acc[article.title] = article._id;
        return acc;
      }, {})

      return Promise.all([
        articleDocs,
        Comment.insertMany(formatCommentData(commentData, articleRefs, userRefs)),
        topicDocs,
        userDocs
      ])
    })
    .catch(console.log)
};

module.exports = seedDB;