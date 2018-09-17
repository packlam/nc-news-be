const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users')

usersRouter.route('/:username')
  .get(getUserByUsername)

module.exports = usersRouter;