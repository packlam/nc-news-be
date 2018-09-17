const apiRouter = require('express').Router();
const { articlesRouter, commentsRouter, topicsRouter, usersRouter } = require('./index');

apiRouter.get('/', (req, res) => {
  res.status(200)
  .send({msg: 'You\'ve landed at the api homepage'})
})

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;